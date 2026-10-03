/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectFindings, structureRules } from '@drizztdourden08/standards/structure';
import brockApp from '../standards.extension.mjs';

const roots = [];

const tree = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-standards-'));
  roots.push(root);
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
  }
  return root;
};

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('the brock-app extension', () => {
  it('marks an app by brock.config.ts and accepts <id>.task.ts boot tasks', async () => {
    const root = tree({ 'package.json': '{ "name": "app" }', 'brock.config.ts': '', 'src/main.tsx': '', 'src/boot/theme.task.ts': '' });
    expect(await collectFindings(root, '@app', [brockApp])).toEqual({ findings: [], notes: [], counted: 1 });
  });

  it('keeps build/installer to the two overrides', async () => {
    const root = tree({ 'package.json': '{ "name": "app" }', 'brock.config.ts': '', 'build/installer/notes.txt': '' });
    const { findings } = await collectFindings(root, '@app', [brockApp]);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatch(/^build\/installer\/notes\.txt: build\/installer holds only /);
  });

  it('lists <id>.task.ts in the module file message', () => {
    expect(structureRules([brockApp]).moduleFiles.map((entry) => entry.label)).toEqual(['<id>.task.ts']);
  });

  it('is what brock-build declares for discovery', async () => {
    const { default: pkg } = await import('../package.json', { with: { type: 'json' } });
    expect(pkg.standards).toEqual({ extension: './standards.extension.mjs' });
  });
});
