#!/usr/bin/env python3
"""Smoke tests for conceptual-node path:line warnings."""

from __future__ import annotations

import xml.etree.ElementTree as ET

import audit_drawio as audit

SAMPLE = """<?xml version="1.0"?>
<mxfile>
  <diagram id="d1" name="Flow">
    <mxGraphModel pageWidth="800" pageHeight="600">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="n1" value="Validate proposal&lt;br&gt;src/task.py:10" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="n2" value="Validate proposal&lt;br&gt;S1" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="140" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="impl" value="Impl map&lt;br&gt;S1 → src/task.py:10-20" style="rounded=1;whiteSpace=wrap;html=1;align=left;" vertex="1" parent="1">
          <mxGeometry x="40" y="240" width="220" height="80" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""


def test_flags_path_line_in_content_node():
    root = ET.fromstring(SAMPLE)
    diagram = root.find("diagram")
    assert diagram is not None
    issues, _ = audit.audit_page(diagram)
    messages = [i.message for i in issues if i.cell == "n1"]
    assert any("path:line" in m or "source path" in m for m in messages), messages


def test_allows_short_badge():
    root = ET.fromstring(SAMPLE)
    diagram = root.find("diagram")
    assert diagram is not None
    issues, _ = audit.audit_page(diagram)
    bad = [
        i
        for i in issues
        if i.cell == "n2" and ("path:line" in i.message or "source path" in i.message)
    ]
    assert bad == []


def test_allows_impl_map_region():
    root = ET.fromstring(SAMPLE)
    diagram = root.find("diagram")
    assert diagram is not None
    issues, _ = audit.audit_page(diagram)
    bad = [
        i
        for i in issues
        if i.cell == "impl" and ("path:line" in i.message or "source path" in i.message)
    ]
    assert bad == []


if __name__ == "__main__":
    test_flags_path_line_in_content_node()
    test_allows_short_badge()
    test_allows_impl_map_region()
    print("OK")
