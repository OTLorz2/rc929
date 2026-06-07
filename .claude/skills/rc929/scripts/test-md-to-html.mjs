#!/usr/bin/env node
/**
 * Golden-file tests for rc929 md-to-html converter.
 */

import { readFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONVERTER = join(__dirname, 'md-to-html.mjs');
const FIXTURES = join(__dirname, 'fixtures');
const SAMPLE_MD = join(FIXTURES, 'sample-report.md');
const OUTPUT = join(FIXTURES, 'sample-report.output.html');

function runConverter(input, output, expectCode = 0) {
  const r = spawnSync(process.execPath, [CONVERTER, input, '-o', output], {
    encoding: 'utf8',
    cwd: join(__dirname, '../..'),
  });
  if (r.status !== expectCode) {
    return {
      ok: false,
      msg: `Expected exit ${expectCode}, got ${r.status}\nstdout: ${r.stdout}\nstderr: ${r.stderr}`,
    };
  }
  return { ok: true, stdout: r.stdout, stderr: r.stderr };
}

function countMatches(html, pattern) {
  const m = html.match(pattern);
  return m ? m.length : 0;
}

const tests = [];

tests.push({
  name: '--help prints usage',
  run() {
    const r = spawnSync(process.execPath, [CONVERTER, '--help'], { encoding: 'utf8' });
    if (r.status !== 0) return { ok: false, msg: 'exit non-zero' };
    if (!r.stdout.includes('md-to-html')) return { ok: false, msg: 'missing usage text' };
    return { ok: true };
  },
});

tests.push({
  name: 'rejects missing frontmatter',
  run() {
    const invalid = join(FIXTURES, 'invalid-missing-frontmatter.md');
    const out = join(FIXTURES, 'invalid-missing-frontmatter.html');
    const r = runConverter(invalid, out, 1);
    if (!r.ok) return r;
    if (existsSync(out)) unlinkSync(out);
    return { ok: true };
  },
});

tests.push({
  name: 'rejects missing slug',
  run() {
    const invalid = join(FIXTURES, 'invalid-missing-slug.md');
    const out = join(FIXTURES, 'invalid-missing-slug.html');
    const r = runConverter(invalid, out, 1);
    if (!r.ok) return r;
    if (existsSync(out)) unlinkSync(out);
    return { ok: true };
  },
});

tests.push({
  name: 'converts valid fixture',
  run() {
    const r = runConverter(SAMPLE_MD, OUTPUT, 0);
    if (!r.ok) return r;
    if (!existsSync(OUTPUT)) return { ok: false, msg: 'output file not created' };
    return { ok: true };
  },
});

tests.push({
  name: 'output structure assertions',
  run() {
    if (!existsSync(OUTPUT)) return { ok: false, msg: 'run convert test first' };
    const html = readFileSync(OUTPUT, 'utf8');

    const checks = [
      ['section summary', /<section id="summary">/.test(html)],
      ['summary-list', /class="summary-list"/.test(html)],
      ['mermaid sg_', /subgraph sg_agent/.test(html)],
      ['diagram-caption Sources', /class="diagram-caption">Sources:/.test(html) || /<p class="diagram-caption">Sources:/.test(html)],
      ['section-prose count', countMatches(html, /class="section-prose"/g) >= 4],
      ['evidence-stack', /class="evidence-stack"/.test(html)],
      ['snippet language', /class="snippet language-markdown"/.test(html)],
      ['toc summary link', /href="#summary"[^>]*>[\s\S]*?要点/.test(html)],
      ['no placeholders', !html.includes('{{')],
    ];

    const failed = checks.filter(([, pass]) => !pass).map(([name]) => name);
    if (failed.length) return { ok: false, msg: `failed: ${failed.join(', ')}` };
    return { ok: true };
  },
});

let passed = 0;
let failed = 0;

for (const t of tests) {
  const result = t.run();
  if (result.ok) {
    console.log(`PASS  ${t.name}`);
    passed++;
  } else {
    console.log(`FAIL  ${t.name}: ${result.msg}`);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
