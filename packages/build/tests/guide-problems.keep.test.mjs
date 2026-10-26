/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { guideProblems } from '../src/tessera/write-guide.mjs';

const made = [];

const FAKE_CLI = [
  "import { writeFileSync } from 'node:fs';",
  "import { join } from 'node:path';",
  'const runTessera = async (args, options) => {',
  "  writeFileSync(join(options.cwd, 'parts.ts'), 'one\\ntwo\\n');",
  '  return 0;',
  '};',
  'export { runTessera };',
  '',
].join('\n');

const put = (root) => ([file, text]) => {
  const target = join(root, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, typeof text === 'string' ? text : JSON.stringify(text));
};

const app = (parts) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-guide-problems-'));
  made.push(root);
  Object.entries({
    'package.json': { name: 'acme', devDependencies: { '@drizztdourden08/tessera': '^0.25.0' } },
    'tessera.config.json': { guide: { parts: 'parts.ts' } },
    'node_modules/@drizztdourden08/tessera/package.json': { name: '@drizztdourden08/tessera', type: 'module', exports: { './cli': './cli.mjs' } },
    'node_modules/@drizztdourden08/tessera/cli.mjs': FAKE_CLI,
    ...(parts === null ? {} : { 'parts.ts': parts }),
  }).forEach(put(root));
  return root;
};

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('guideProblems', () => {
  it('names the guide.parts file when its content differs from what tessera guide writes, and leaves it as it was', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const root = app('one\r\n');
    expect(await guideProblems(root)).toEqual(['parts.ts does not list the parts of the app; run brock sync to write it']);
    expect(readFileSync(join(root, 'parts.ts'), 'utf8')).toBe('one\r\n');
  });

  it('reports a guide.parts file that is missing, and does not leave it behind', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const root = app(null);
    expect(await guideProblems(root)).toHaveLength(1);
    expect(existsSync(join(root, 'parts.ts'))).toBe(false);
  });

  it('accepts a file with the same content, in LF or CRLF', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    expect(await guideProblems(app('one\ntwo\n'))).toEqual([]);
    const crlf = app('one\r\ntwo\r\n');
    expect(await guideProblems(crlf)).toEqual([]);
    expect(readFileSync(join(crlf, 'parts.ts'), 'utf8')).toBe('one\r\ntwo\r\n');
  });
});
