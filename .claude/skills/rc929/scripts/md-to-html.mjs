#!/usr/bin/env node
/**
 * rc929 markdown → HTML converter.
 * Zero npm dependencies. Node.js 18+.
 *
 * Usage:
 *   node md-to-html.mjs <input.md> [-o output.html] [--shell path]
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_SHELL = join(__dirname, '../references/html-shell-template.html');

const LANG_MAP = {
  json: 'language-json',
  md: 'language-markdown',
  markdown: 'language-markdown',
  py: 'language-python',
  python: 'language-python',
  go: 'language-go',
  ts: 'language-typescript',
  tsx: 'language-typescript',
  js: 'language-javascript',
  jsx: 'language-javascript',
  yaml: 'language-yaml',
  yml: 'language-yaml',
  sh: 'language-bash',
  bash: 'language-bash',
};

const REQUIRED_FM = ['title', 'question', 'date'];
const PROSE_MIN = 80;

function printHelp() {
  console.log(`rc929 md-to-html — convert research markdown to HTML

Usage:
  node md-to-html.mjs <input.md> [-o output.html] [--shell path]

Options:
  -o <path>     Output HTML path (default: same stem as input, .html)
  --shell <path> HTML shell template (default: references/html-shell-template.html)
  -h, --help    Show this help
`);
}

function parseArgs(argv) {
  const args = { input: null, output: null, shell: DEFAULT_SHELL, help: false };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '-h' || a === '--help') args.help = true;
    else if (a === '-o') args.output = rest[++i];
    else if (a === '--shell') args.shell = resolve(rest[++i]);
    else if (!a.startsWith('-') && !args.input) args.input = resolve(a);
    else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return args;
}

function parseFrontmatter(text) {
  const trimmed = text.trimStart();
  if (!trimmed.startsWith('---')) {
    return { frontmatter: {}, body: text };
  }
  const end = trimmed.indexOf('\n---', 3);
  if (end === -1) {
    return { frontmatter: {}, body: text };
  }
  const fmBlock = trimmed.slice(3, end).trim();
  const body = trimmed.slice(end + 4).replace(/^\s*\n/, '');
  const frontmatter = {};
  for (const line of fmBlock.split('\n')) {
    const m = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    frontmatter[m[1]] = val;
  }
  return { frontmatter, body };
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineFormat(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, (_, code) => {
    const cls = /:[\d-]+/.test(code) ? ' class="ref"' : '';
    return `<code${cls}>${escapeHtml(code)}</code>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out;
}

function parseEvidenceAttrs(attrStr) {
  const attrs = {};
  const re = /(\w+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(attrStr)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function parseSectionBlocks(content) {
  const lines = content.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (line.startsWith('```mermaid')) {
      const mermaidLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        mermaidLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].startsWith('```')) i++;
      while (i < lines.length && lines[i].trim() === '') i++;
      let caption = null;
      if (i < lines.length && lines[i].trim().startsWith('Sources:')) {
        caption = lines[i].trim();
        i++;
      }
      blocks.push({ type: 'mermaid', source: mermaidLines.join('\n').trim(), caption });
      continue;
    }

    if (line.startsWith(':::evidence{')) {
      const attrEnd = line.indexOf('}');
      const attrs = parseEvidenceAttrs(line.slice(':::evidence{'.length, attrEnd));
      const evLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') {
        evLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({ type: 'evidence', attrs, source: evLines.join('\n') });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'olist', items, summary: blocks.length === 0 });
      continue;
    }

    if (/^-\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^-\s/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ulist', items });
      continue;
    }

    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('```') && !lines[i].startsWith(':::evidence{') && !/^\d+\.\s/.test(lines[i]) && !/^-\s/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'prose', text: paraLines.join('\n') });
  }

  return blocks;
}

function parseSections(body) {
  const sections = [];
  const parts = body.split(/^## /m).filter(Boolean);

  for (const part of parts) {
    const firstNewline = part.indexOf('\n');
    const headingLine = firstNewline === -1 ? part.trim() : part.slice(0, firstNewline).trim();
    const content = firstNewline === -1 ? '' : part.slice(firstNewline + 1).trim();

    const m = headingLine.match(/^(.+?)\s+\{#(\w+)\}\s*$/);
    if (!m) {
      sections.push({ title: headingLine, slug: null, blocks: parseSectionBlocks(content) });
    } else {
      sections.push({ title: m[1].trim(), slug: m[2], blocks: parseSectionBlocks(content) });
    }
  }

  return sections;
}

function proseCharCount(blocks, beforeIndex) {
  let n = 0;
  for (let i = 0; i < beforeIndex; i++) {
    if (blocks[i].type === 'prose') n += blocks[i].text.replace(/\s+/g, ' ').trim().length;
  }
  return n;
}

function proseAfterMermaid(blocks, mermaidIndex) {
  let n = 0;
  for (let i = mermaidIndex + 1; i < blocks.length; i++) {
    if (blocks[i].type === 'prose') n += blocks[i].text.replace(/\s+/g, ' ').trim().length;
  }
  return n;
}

function validate(frontmatter, sections) {
  const errors = [];
  const warnings = [];

  for (const key of REQUIRED_FM) {
    if (!frontmatter[key] || !String(frontmatter[key]).trim()) {
      errors.push(`Missing required frontmatter field: ${key}`);
    }
  }

  const slugs = sections.map((s) => s.slug);
  for (const s of sections) {
    if (!s.slug) {
      errors.push(`Section "${s.title}" is missing {#slug} anchor`);
    }
  }

  for (const s of sections) {
    for (let bi = 0; bi < s.blocks.length; bi++) {
      const b = s.blocks[bi];
      if (b.type !== 'mermaid') continue;

      const before = proseCharCount(s.blocks, bi);
      const after = proseAfterMermaid(s.blocks, bi);
      if (before < PROSE_MIN) {
        errors.push(`Section "${s.title}": Mermaid diagram needs ≥${PROSE_MIN} chars of prose before it (found ${before})`);
      }
      if (after < PROSE_MIN) {
        errors.push(`Section "${s.title}": Mermaid diagram needs ≥${PROSE_MIN} chars of prose after Sources line (found ${after})`);
      }

      for (const slug of slugs) {
        if (!slug) continue;
        const bareId = new RegExp(`\\b${slug}\\b`);
        if (bareId.test(b.source) && !b.source.includes(`sg_${slug}`) && !b.source.includes(`n_${slug}`)) {
          const asNode = new RegExp(`\\b${slug}\\[|\\b${slug}\\s*\\(|\\bsubgraph\\s+${slug}\\b`);
          if (asNode.test(b.source)) {
            errors.push(`Section "${s.title}": Mermaid uses bare id "${slug}" — use sg_ or n_ prefix`);
          }
        }
      }
    }
  }

  const summary = sections.find((s) => s.slug === 'summary');
  if (summary && !summary.blocks.some((b) => b.type === 'olist')) {
    warnings.push('#summary section has no ordered list');
  }

  return { errors, warnings };
}

function renderProse(text) {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return '';
  const inner = paragraphs.map((p) => `<p>${inlineFormat(p)}</p>`).join('\n          ');
  return `          <div class="section-prose">\n            ${inner}\n          </div>`;
}

function renderList(block, slug) {
  const tag = block.type === 'olist' ? 'ol' : 'ul';
  const cls = block.type === 'olist' && slug === 'summary' ? ' class="summary-list"' : '';
  const items = block.items.map((item) => `            <li>${inlineFormat(item)}</li>`).join('\n');
  return `          <${tag}${cls}>\n${items}\n          </${tag}>`;
}

function renderMermaid(block) {
  const src = escapeHtml(block.source);
  let html = `          <div class="diagram-wrap">\n            <pre class="mermaid">\n${src}\n            </pre>`;
  if (block.caption) {
    html += `\n            <p class="diagram-caption">${inlineFormat(block.caption)}</p>`;
  }
  html += '\n          </div>';
  return html;
}

function renderEvidence(block) {
  const { file, lines, lang } = block.attrs;
  const langClass = LANG_MAP[lang] || (lang ? `language-${lang}` : '');
  const clsAttr = langClass ? ` class="snippet ${langClass}"` : ' class="snippet"';
  const summaryLabel = file ? `${escapeHtml(file.split('/').pop())} 结构` : '证据';
  const ref = file && lines ? `${escapeHtml(file)}:${escapeHtml(lines)}` : '';
  const code = escapeHtml(block.source);
  return `            <details>\n              <summary>${summaryLabel} <code class="ref">${ref}</code></summary>\n              <pre${clsAttr}>${code}</pre>\n            </details>`;
}

function renderSection(section, index) {
  const num = String(index + 1).padStart(2, '0');
  const parts = [];
  parts.push(`        <section id="${section.slug}">`);
  parts.push(`          <div class="section-head"><span class="section-num">${num}</span><h2>${escapeHtml(section.title)}</h2></div>`);

  const evidenceBlocks = section.blocks.filter((b) => b.type === 'evidence');
  let evidenceRendered = false;

  for (const block of section.blocks) {
    if (block.type === 'prose') {
      parts.push(renderProse(block.text));
    } else if (block.type === 'olist' || block.type === 'ulist') {
      parts.push(renderList(block, section.slug));
    } else if (block.type === 'mermaid') {
      parts.push(renderMermaid(block));
    } else if (block.type === 'evidence') {
      if (!evidenceRendered) {
        parts.push('          <div class="evidence-stack">');
        evidenceRendered = true;
      }
      parts.push(renderEvidence(block));
    }
  }

  if (evidenceRendered) {
    parts.push('          </div>');
  }

  parts.push('        </section>');
  return parts.join('\n');
}

function renderMain(sections) {
  return sections.map((s, i) => renderSection(s, i)).join('\n\n');
}

function renderToc(sections) {
  return sections
    .map((s, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `              <li><a href="#${s.slug}"><span class="idx">${num}</span>${escapeHtml(s.title)}</a></li>`;
    })
    .join('\n');
}

function renderMetaPills(fm) {
  const pills = [];
  if (fm.repo) pills.push(`<span class="meta-pill"><strong>Repo</strong> ${escapeHtml(fm.repo)}</span>`);
  if (fm.date) pills.push(`<span class="meta-pill"><strong>Date</strong> ${escapeHtml(fm.date)}</span>`);
  if (fm.commit) pills.push(`<span class="meta-pill"><strong>Commit</strong> ${escapeHtml(fm.commit)}</span>`);
  if (fm.branch) pills.push(`<span class="meta-pill"><strong>Branch</strong> ${escapeHtml(fm.branch)}</span>`);
  return pills.join('\n            ');
}

function inject(shell, fm, toc, main, footer) {
  return shell
    .replace(/\{\{TITLE\}\}/g, escapeHtml(fm.title || ''))
    .replace(/\{\{HERO_EYEBROW\}\}/g, escapeHtml(fm.eyebrow || 'rc929 Research'))
    .replace(/\{\{HERO_TITLE\}\}/g, escapeHtml(fm.title || ''))
    .replace(/\{\{META_PILLS\}\}/g, renderMetaPills(fm))
    .replace(/\{\{QUESTION\}\}/g, escapeHtml(fm.question || ''))
    .replace(/\{\{TOC_ITEMS\}\}/g, toc)
    .replace(/\{\{MAIN_CONTENT\}\}/g, main)
    .replace(/\{\{FOOTER\}\}/g, escapeHtml(fm.footer || 'Generated by rc929'));
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    process.exit(0);
  }
  if (!args.input) {
    console.error('Error: input .md file required\n');
    printHelp();
    process.exit(1);
  }
  if (extname(args.input).toLowerCase() !== '.md') {
    console.error('Error: input must be a .md file');
    process.exit(1);
  }

  const output = args.output || args.input.replace(/\.md$/i, '.html');

  let mdText;
  let shellText;
  try {
    mdText = readFileSync(args.input, 'utf8');
    shellText = readFileSync(args.shell, 'utf8');
  } catch (e) {
    console.error(`Error reading file: ${e.message}`);
    process.exit(1);
  }

  const { frontmatter, body } = parseFrontmatter(mdText);
  const sections = parseSections(body);
  const { errors, warnings } = validate(frontmatter, sections);

  for (const w of warnings) console.warn(`Warning: ${w}`);
  if (errors.length > 0) {
    for (const e of errors) console.error(`Error: ${e}`);
    process.exit(1);
  }

  if (sections.length === 0) {
    console.error('Error: no sections found (use ## Title {#slug})');
    process.exit(1);
  }

  const toc = renderToc(sections);
  const mainHtml = renderMain(sections);
  const html = inject(shellText, frontmatter, toc, mainHtml, frontmatter.footer);

  if (html.includes('{{')) {
    console.error('Error: unreplaced placeholders in output');
    process.exit(1);
  }

  try {
    writeFileSync(output, html, 'utf8');
  } catch (e) {
    console.error(`Error writing output: ${e.message}`);
    process.exit(1);
  }

  console.log(`Wrote ${output}`);
}

main();
