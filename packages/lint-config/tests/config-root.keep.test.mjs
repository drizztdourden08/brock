/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { configRoot } from '../config-root.mjs';
import { LINT_TIMEOUT_MS, app, put, removeRoots } from './lint-fixture.mjs';

afterEach(removeRoots);

const FACTORY = pathToFileURL(join(import.meta.dirname, '..', 'eslint.mjs')).href;
const ESLINT = pathToFileURL(join(import.meta.dirname, '..', 'node_modules', 'eslint', 'lib', 'api.js')).href;
const VERBATIM = '/* @layer shared-game @kind verbatim @source the dialogue table of a game */\n';
const DASH = String.fromCodePoint(0x2014);
const DIALOGUE = `const DIALOGUE = ['Beware${DASH}the bridge is out.'];\n\nexport { DIALOGUE };\n`;
const CONFIG = `import { brockEslint } from '${FACTORY}';\n\nexport default brockEslint({ typed: false });\n`;

const runner = (file) => [
  `import { ESLint } from '${ESLINT}';`,
  'const eslint = new ESLint();',
  `const [result] = await eslint.lintFiles([${JSON.stringify(file)}]);`,
  'process.stdout.write(JSON.stringify(result.messages.map((m) => m.ruleId)));',
].join('\n');

describe('the default rootDir of brockEslint', () => {
  it('is the folder of the nearest eslint.config file, not the folder ESLint runs from', () => {
    const root = app();
    put(root, 'eslint.config.mjs', CONFIG);
    put(root, 'apps/web/src/readme.txt', 'x');
    expect(realpathSync(configRoot(join(root, 'apps', 'web', 'src')))).toBe(realpathSync(root));
  });

  it('is the current folder when no eslint.config file sits above it', () => {
    const root = app();
    expect(realpathSync(configRoot(root))).toBe(realpathSync(root));
  });

  it('marks a verbatim file when ESLint runs from a subfolder and no rootDir is passed', () => {
    const root = app();
    put(root, 'eslint.config.mjs', CONFIG);
    put(root, 'apps/web/src/text/dialogue.ts', `${VERBATIM}${DIALOGUE}`);
    const out = execFileSync(process.execPath, ['--input-type=module', '-e', runner('src/text/dialogue.ts')], { cwd: join(root, 'apps', 'web'), encoding: 'utf8' });
    expect(JSON.parse(out).filter((rule) => rule === 'local/no-em-dash')).toEqual([]);
  }, LINT_TIMEOUT_MS);
});
