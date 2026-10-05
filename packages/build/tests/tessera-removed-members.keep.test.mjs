/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { tesseraRenamesStep } from '../src/upgrade/tessera/tessera-renames-step.mjs';

const RELEASE = {
  version: '0.20.0',
  removedExports: { 'Text.CodeBlock': 'CodeBlock, imported on its own', mascotForBrand: 'removed; AnimatedMascot brand="auto" picks it' },
};

const TESSERA = join('node_modules', '@drizztdourden08', 'tessera');

const roots = [];

const replayOver = (view) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-removed-members-'));
  roots.push(root);
  for (const dir of ['src', TESSERA]) mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(join(root, 'package.json'), '{ "name": "app" }\n');
  writeFileSync(join(root, TESSERA, 'package.json'), '{ "name": "@drizztdourden08/tessera", "version": "0.20.0" }\n');
  writeFileSync(join(root, TESSERA, 'RENAMES.json'), JSON.stringify({ releases: [RELEASE] }));
  writeFileSync(join(root, 'src', 'view.tsx'), view);
  return tesseraRenamesStep({ rootDir: root, from: '0.19.0' }).applied.flatMap((entry) => entry.todos.map((todo) => `${todo.line} ${todo.message}`));
};

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

describe('a removed member such as Text.CodeBlock', () => {
  it('leaves Text alone where the file never reaches Text.CodeBlock', () => {
    const todos = replayOver("import { Text } from '@drizztdourden08/tessera/primitives';\nexport const View = () => <Text>hi</Text>;\n");
    expect(todos).toEqual([]);
  });

  it('is a to-do on each line that uses it, in JSX or as a value', () => {
    const view = [
      "import { Text as T } from '@drizztdourden08/tessera/primitives';",
      'export const View = () => (',
      '  <T.CodeBlock code="x" />',
      ');',
      'export const Block = T.CodeBlock;',
      '',
    ].join('\n');
    const todos = replayOver(view);
    expect(todos).toEqual([
      expect.stringMatching(/^3 .*no longer exports Text\.CodeBlock: CodeBlock, imported on its own/),
      expect.stringMatching(/^5 .*no longer exports Text\.CodeBlock/),
    ]);
  });

  it('still names a removed export on its import line', () => {
    const todos = replayOver("import { mascotForBrand } from '@drizztdourden08/tessera/brand';\nexport const m = mascotForBrand('brock');\n");
    expect(todos).toEqual([expect.stringMatching(/^1 .*no longer exports mascotForBrand/)]);
  });
});
