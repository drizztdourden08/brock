/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkShapes } from '../src/commands/structure-shape.mjs';

const roots = [];

const tree = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-structure-'));
  roots.push(root);
  for (const file of files) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), '');
  }
  return root;
};

const BUTTON = ['src/index.ts', 'src/primitives/Button/Button.tsx', 'src/primitives/Button/index.ts'];
const WITH_SUB = [...BUTTON, 'src/primitives/Button/sub-components/ButtonIcon/ButtonIcon.tsx', 'src/primitives/Button/sub-components/ButtonIcon/index.ts'];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('checkShapes usage files', () => {
  it('accepts Name.usage.ts in any component folder', () => {
    const root = tree([...BUTTON, 'src/primitives/Button/Button.usage.ts']);
    expect(checkShapes(root, join(root, 'src'))).toEqual([]);
  });

  it('asks nothing of a package that does not opt in', () => {
    const root = tree(BUTTON);
    expect(checkShapes(root, join(root, 'src'))).toEqual([]);
  });

  it('requires Name.usage.ts in every design-system component folder, not in sub-components', () => {
    const root = tree(WITH_SUB);
    expect(checkShapes(root, join(root, 'src'), [], { designSystem: true })).toEqual([
      'src/primitives/Button: missing Button.usage.ts (every design-system component documents when to use it)',
    ]);
  });

  it('passes a design-system component that has its usage file', () => {
    const root = tree([...WITH_SUB, 'src/primitives/Button/Button.usage.ts']);
    expect(checkShapes(root, join(root, 'src'), [], { designSystem: true })).toEqual([]);
  });
});
