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
    expect(structureRules([brockApp]).moduleFiles.map((entry) => entry.label)).toEqual(['<id>.task.ts', '<id>.widget.tsx', '<id>.step.ts', '<id>.action.ts', '<id>.tour.ts']);
  });

  it('accepts src/widgets/<id>.widget.tsx files with a default export and a known meta', async () => {
    const widget = "const meta = { label: 'Notes', icon: 'pencil', popOut: true };\nconst Notes = () => null;\nexport default Notes;\nexport { meta };\n";
    const root = tree({ 'package.json': '{ "name": "app" }', 'brock.config.ts': '', 'src/main.tsx': '', 'src/widgets/notes.widget.tsx': widget });
    expect((await collectFindings(root, '@app', [brockApp])).findings).toEqual([]);
  });

  it('names whatever does not belong in src/widgets', async () => {
    const root = tree({
      'package.json': '{ "name": "app" }',
      'brock.config.ts': '',
      'src/widgets/session-layout.ts': '',
      'src/widgets/live-room/room.ts': '',
      'src/widgets/Players.widget.tsx': 'export default null;\n',
      'src/widgets/hints.widget.tsx': 'const Hints = () => null;\nexport { Hints };\n',
      'src/widgets/logs.widget.tsx': 'export default null;\n',
      'src/widgets/room.widget.tsx': "const meta = { title: 'Room' };\nexport default null;\nexport { meta };\n",
    });
    const { findings } = await collectFindings(root, '@app', [brockApp]);
    expect(findings.map((finding) => finding.split(': ')[0]).sort()).toEqual([
      'src/widgets/Players.widget.tsx',
      'src/widgets/hints.widget.tsx',
      'src/widgets/live-room',
      'src/widgets/logs.widget.tsx',
      'src/widgets/room.widget.tsx',
      'src/widgets/session-layout.ts',
    ]);
    expect(findings).toContain('src/widgets/room.widget.tsx: meta.title is not a widget field (label, icon, order, popOut, devOnly, taskbar, settings, defaultOpen, defaultVisibility, defaultSide, defaultDockedSize, defaultFloatingSize, padding, fill)');
    expect(findings).toContain('src/widgets/logs.widget.tsx: "logs" is a built-in Brock widget id; pick another');
  });

  it('leaves the src/widgets folder of a package that is not an app to the shape check', async () => {
    const root = tree({ 'package.json': '{ "name": "@app/kit", "exports": "./src/index.ts" }', 'src/index.ts': '', 'src/widgets/logs.widget.tsx': 'export default null;\n' });
    expect((await collectFindings(root, '@app', [brockApp])).findings).toEqual([]);
  });

  it('is what brock-build declares for discovery', async () => {
    const { default: pkg } = await import('../package.json', { with: { type: 'json' } });
    expect(pkg.standards).toEqual({ extension: './standards.extension.mjs' });
  });
});
