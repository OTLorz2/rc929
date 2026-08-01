#!/usr/bin/env python3
"""Audit uncompressed draw.io XML and protect untouched pages."""

from __future__ import annotations

import argparse
import copy
import hashlib
import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable


@dataclass(frozen=True)
class Issue:
    level: str
    page: str
    cell: str | None
    message: str


@dataclass(frozen=True)
class Box:
    cell: str
    label: str
    x: float
    y: float
    width: float
    height: float


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(
        description="Audit uncompressed .drawio XML and compare untouched pages."
    )
    result.add_argument("file", type=Path)
    result.add_argument("--page", help="Audit one page by exact name.")
    result.add_argument("--snapshot", type=Path, help="Write page hashes as JSON.")
    result.add_argument(
        "--baseline",
        type=Path,
        help="Compare all non-target pages with a prior --snapshot.",
    )
    result.add_argument("--json", action="store_true", help="Emit JSON output.")
    result.add_argument(
        "--strict",
        action="store_true",
        help="Return exit code 2 when warnings remain.",
    )
    return result


def sha256(element: ET.Element) -> str:
    page = copy.deepcopy(element)
    page.tail = None
    return hashlib.sha256(ET.tostring(page, encoding="utf-8")).hexdigest()


def visible_text(value: str) -> str:
    unescaped = html.unescape(value)
    without_tags = re.sub(r"<[^>]+>", " ", unescaped)
    return " ".join(without_tags.split())


def style_has(style: str, token: str) -> bool:
    return token in {part.split("=", 1)[0] for part in style.split(";") if part}


PATH_LINE_IN_LABEL = re.compile(
    r"(?:^|[\s/])[\w./-]+\.[A-Za-z0-9]+:\d+(?:-\d+)?"
)


def is_supporting_region(label: str) -> bool:
    """Regions that may legitimately contain path:line cites."""
    head = label.strip().lower()
    return (
        head.startswith("impl map")
        or head.startswith("summary")
        or head.startswith("styles:")
        or head.startswith("legend")
        or head.startswith("要点")
    )


def number(
    raw: str | None,
    *,
    page: str,
    cell: str,
    field: str,
    issues: list[Issue],
) -> float | None:
    if raw is None:
        issues.append(Issue("error", page, cell, f"Missing geometry field '{field}'."))
        return None
    try:
        return float(raw)
    except ValueError:
        issues.append(
            Issue("error", page, cell, f"Geometry field '{field}' is not numeric.")
        )
        return None


def overlaps(left: Box, right: Box) -> bool:
    return (
        left.x < right.x + right.width
        and left.x + left.width > right.x
        and left.y < right.y + right.height
        and left.y + left.height > right.y
    )


def collinear(first: ET.Element, second: ET.Element, third: ET.Element) -> bool:
    coordinates = []
    for point in (first, second, third):
        try:
            coordinates.append((float(point.attrib["x"]), float(point.attrib["y"])))
        except (KeyError, ValueError):
            return False
    (x1, y1), (x2, y2), (x3, y3) = coordinates
    return (x1 == x2 == x3) or (y1 == y2 == y3)


def page_model(diagram: ET.Element) -> ET.Element | None:
    return diagram.find("mxGraphModel")


def audit_page(diagram: ET.Element) -> tuple[list[Issue], dict[str, int]]:
    page = diagram.attrib.get("name", "<unnamed>")
    issues: list[Issue] = []
    model = page_model(diagram)
    if model is None:
        message = (
            "Compressed or unsupported diagram content; open and save it uncompressed "
            "before XML editing."
        )
        return [Issue("error", page, None, message)], {"vertices": 0, "edges": 0}

    root = model.find("root")
    if root is None:
        return [Issue("error", page, None, "Missing mxGraphModel/root.")], {
            "vertices": 0,
            "edges": 0,
        }

    cells = root.findall("mxCell")
    ids = [cell.attrib.get("id", "") for cell in cells]
    known = set(ids)
    if "" in known:
        issues.append(Issue("error", page, None, "Every mxCell must have an ID."))
    if len(ids) != len(known):
        issues.append(Issue("error", page, None, "Duplicate mxCell IDs found."))
    for required in ("0", "1"):
        if required not in known:
            issues.append(Issue("error", page, None, f"Missing root cell '{required}'."))

    vertices = [cell for cell in cells if cell.attrib.get("vertex") == "1"]
    edges = [cell for cell in cells if cell.attrib.get("edge") == "1"]

    for cell in cells:
        cell_id = cell.attrib.get("id", "<missing>")
        for attribute in ("parent", "source", "target"):
            reference = cell.attrib.get(attribute)
            if reference is not None and reference not in known:
                issues.append(
                    Issue(
                        "error",
                        page,
                        cell_id,
                        f"Unresolved {attribute} reference '{reference}'.",
                    )
                )

    page_width = number(
        model.attrib.get("pageWidth"),
        page=page,
        cell="<page>",
        field="pageWidth",
        issues=issues,
    )
    page_height = number(
        model.attrib.get("pageHeight"),
        page=page,
        cell="<page>",
        field="pageHeight",
        issues=issues,
    )

    boxes: list[Box] = []
    content_nodes = 0
    for cell in vertices:
        cell_id = cell.attrib.get("id", "<missing>")
        geometry = cell.find("mxGeometry")
        if geometry is None:
            issues.append(Issue("error", page, cell_id, "Vertex has no mxGeometry."))
            continue
        values = {
            field: number(
                geometry.attrib.get(field),
                page=page,
                cell=cell_id,
                field=field,
                issues=issues,
            )
            for field in ("x", "y", "width", "height")
        }
        if any(value is None for value in values.values()):
            continue
        x, y = values["x"], values["y"]
        width, height = values["width"], values["height"]
        assert x is not None and y is not None and width is not None and height is not None
        if min(x, y, width, height) < 0:
            issues.append(Issue("error", page, cell_id, "Vertex geometry is negative."))
        if (
            page_width is not None
            and page_height is not None
            and (x + width > page_width or y + height > page_height)
        ):
            issues.append(
                Issue("error", page, cell_id, "Vertex extends beyond the page bounds.")
            )

        label = visible_text(cell.attrib.get("value", ""))
        style = cell.attrib.get("style", "")
        is_text = style.startswith("text;") or style_has(style, "text")
        is_container = (
            not label
            or style_has(style, "swimlane")
            or "container=1" in style
            or "group" in style
        )
        if label and not is_text and not is_container:
            boxes.append(Box(cell_id, label, x, y, width, height))
            if is_supporting_region(label):
                # Impl map / Summary / legend prose: may contain cites; not process nodes.
                pass
            else:
                content_nodes += 1
                if PATH_LINE_IN_LABEL.search(label):
                    issues.append(
                        Issue(
                            "warning",
                            page,
                            cell_id,
                            "Content node label contains a source path:line; "
                            "use a short evidence badge (S1) and put the cite in the Impl map.",
                        )
                    )

    for index, left in enumerate(boxes):
        for right in boxes[index + 1 :]:
            if overlaps(left, right):
                issues.append(
                    Issue(
                        "warning",
                        page,
                        f"{left.cell},{right.cell}",
                        f"Labeled nodes overlap: '{left.label}' and '{right.label}'.",
                    )
                )

    for edge in edges:
        cell_id = edge.attrib.get("id", "<missing>")
        label = visible_text(edge.attrib.get("value", ""))
        if len(label) > 40:
            issues.append(
                Issue(
                    "warning",
                    page,
                    cell_id,
                    "Edge label exceeds 40 characters; shorten it to reduce collisions.",
                )
            )
        geometry = edge.find("mxGeometry")
        if geometry is None:
            issues.append(Issue("error", page, cell_id, "Edge has no mxGeometry."))
            continue
        points = geometry.findall("./Array[@as='points']/mxPoint")
        if len(points) > 2:
            issues.append(
                Issue(
                    "warning",
                    page,
                    cell_id,
                    f"Edge has {len(points)} explicit routing points; simplify the route.",
                )
            )
        for index in range(len(points) - 2):
            if collinear(points[index], points[index + 1], points[index + 2]):
                issues.append(
                    Issue(
                        "warning",
                        page,
                        cell_id,
                        "Edge contains redundant collinear routing points.",
                    )
                )
                break

    if content_nodes > 10:
        issues.append(
            Issue(
                "warning",
                page,
                None,
                f"{content_nodes} content nodes exceed the focused-page target of 10.",
            )
        )

    return issues, {
        "vertices": len(vertices),
        "content_nodes": content_nodes,
        "edges": len(edges),
    }


def write_snapshot(path: Path, source: Path, diagrams: Iterable[ET.Element]) -> None:
    pages = {
        diagram.attrib.get("name", "<unnamed>"): {
            "id": diagram.attrib.get("id"),
            "sha256": sha256(diagram),
        }
        for diagram in diagrams
    }
    payload = {"version": 2, "source": str(source.resolve()), "pages": pages}
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def compare_baseline(
    path: Path,
    diagrams: list[ET.Element],
    target_page: str | None,
) -> list[Issue]:
    if target_page is None:
        return [
            Issue(
                "error",
                "<file>",
                None,
                "--baseline requires --page so the intended changed page is explicit.",
            )
        ]
    baseline = json.loads(path.read_text(encoding="utf-8"))
    if baseline.get("version") != 2:
        return [
            Issue(
                "error",
                "<file>",
                None,
                "Baseline version is incompatible; create a new --snapshot.",
            )
        ]
    expected = baseline.get("pages", {})
    actual = {
        diagram.attrib.get("name", "<unnamed>"): {
            "id": diagram.attrib.get("id"),
            "sha256": sha256(diagram),
        }
        for diagram in diagrams
    }
    issues: list[Issue] = []
    for name in sorted(set(expected) | set(actual)):
        if name == target_page:
            continue
        if name not in expected:
            issues.append(Issue("error", name, None, "Unexpected non-target page added."))
        elif name not in actual:
            issues.append(Issue("error", name, None, "Non-target page was removed."))
        elif expected[name] != actual[name]:
            issues.append(Issue("error", name, None, "Non-target page changed."))
    return issues


def main() -> int:
    args = parser().parse_args()
    try:
        tree = ET.parse(args.file)
    except (OSError, ET.ParseError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1

    root = tree.getroot()
    if root.tag != "mxfile":
        print("ERROR: Root element must be <mxfile>.", file=sys.stderr)
        return 1

    diagrams = root.findall("diagram")
    issues: list[Issue] = []
    declared_pages = root.attrib.get("pages")
    if declared_pages is not None:
        try:
            if int(declared_pages) != len(diagrams):
                issues.append(
                    Issue(
                        "error",
                        "<file>",
                        None,
                        f"mxfile declares {declared_pages} pages but contains {len(diagrams)}.",
                    )
                )
        except ValueError:
            issues.append(Issue("error", "<file>", None, "Invalid mxfile pages value."))

    page_names = [diagram.attrib.get("name", "<unnamed>") for diagram in diagrams]
    if len(page_names) != len(set(page_names)):
        issues.append(Issue("error", "<file>", None, "Duplicate page names found."))

    if args.page:
        selected = [
            diagram
            for diagram in diagrams
            if diagram.attrib.get("name") == args.page
        ]
        if not selected:
            issues.append(
                Issue("error", args.page, None, "Requested page does not exist.")
            )
    else:
        selected = diagrams

    summaries: dict[str, dict[str, int]] = {}
    for diagram in selected:
        page_issues, summary = audit_page(diagram)
        issues.extend(page_issues)
        summaries[diagram.attrib.get("name", "<unnamed>")] = summary

    if args.baseline:
        try:
            issues.extend(compare_baseline(args.baseline, diagrams, args.page))
        except (OSError, ValueError, json.JSONDecodeError) as error:
            issues.append(
                Issue("error", "<file>", None, f"Cannot read baseline: {error}")
            )

    if args.snapshot:
        try:
            write_snapshot(args.snapshot, args.file, diagrams)
        except OSError as error:
            issues.append(
                Issue("error", "<file>", None, f"Cannot write snapshot: {error}")
            )

    errors = [issue for issue in issues if issue.level == "error"]
    warnings = [issue for issue in issues if issue.level == "warning"]
    result = {
        "file": str(args.file),
        "pages": page_names,
        "summaries": summaries,
        "issues": [asdict(issue) for issue in issues],
        "valid": not errors,
    }

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        for name, summary in summaries.items():
            print(
                f"{name}: {summary['vertices']} vertices, "
                f"{summary['content_nodes']} content nodes, {summary['edges']} edges"
            )
        for issue in issues:
            location = issue.page
            if issue.cell:
                location += f"/{issue.cell}"
            print(f"{issue.level.upper()} {location}: {issue.message}")
        if not issues:
            print("OK: no structural or layout issues found.")

    if errors:
        return 1
    if warnings and args.strict:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
