/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dirs: string[] = [];

const only = (id: string) => selectMigrations(collectMigrations([]), { from: '0.1.1', to: null }).filter((m) => m.file.endsWith(`${id}.mjs`));

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const TESSERA_VIEW = [
  "import { ProgressBar, Badge } from '@drizztdourden08/tessera/primitives';",
  "import { AboutPanel, PortalDocumentContext, WindowTitleBar } from '@drizztdourden08/tessera/composites';",
  "import type { HeroFact, HeroFactRow, ProgressVariant } from '@drizztdourden08/tessera/composites';",
  '',
  "const tone: ProgressVariant = 'danger';",
  "const rows: HeroFactRow[] = [[{ label: 'A', value: 1 } as HeroFact]];",
  'const view = (',
  '  <>',
  '    <ProgressBar value={1} variant={tone} secondaryValue={2} secondaryVariant="primary" />',
  '    <Badge variant="success">ok</Badge>',
  '    <Badge value={3} />',
  '    <AboutPanel title="App" rows={[]} onCopy={write} />',
  '    <PortalDocumentContext value={doc}><div className="hero__facts" /></PortalDocumentContext>',
  '    <WindowTitleBar title="App" menu={<Trigger />} menuOpen={open} onClose={close} onControl={act} />',
  '  </>',
  ');',
  '',
].join('\n');

const CSS = '.hero__facts { gap: 1px; }\n.hero__fact-row { --hero-fact-max-w: 9rem; }\n.hero__fact { color: red; }\n';

const FILES: Readonly<Record<string, string>> = {
  'package.json': '{"name":"x"}',
  'src/view.tsx': TESSERA_VIEW,
  'src/view.css': CSS,
  'src/menu.ts': "import { toDropdownItems } from '@drizztdourden08/brock-react';\nexport const items = toDropdownItems(menu, resolve);\n",
};

const sample = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-tessera-'));
  dirs.push(root);
  mkdirSync(join(root, 'src'));
  for (const [file, text] of Object.entries(FILES)) writeFileSync(join(root, file), text);
  return root;
};

describe('the 0.2.0 migrations', () => {
  it('renames the ProgressBar variants and the HeroFact types and classes', async () => {
    const root = sample();
    const run = await runMigrations(root, [...only('progress-bar-tone'), ...only('facts-panel-names')]);
    const view = readFileSync(join(root, 'src', 'view.tsx'), 'utf8');
    expect(view).toContain('<ProgressBar value={1} tone={tone} secondaryValue={2} secondaryTone="primary" />');
    expect(view).toContain("import type { FactsPanelFact, FactsPanelGroup, ProgressTone } from '@drizztdourden08/tessera/composites';");
    expect(view).toContain('<div className="facts-panel" />');
    expect(view).toContain('<Badge variant="success">ok</Badge>');
    expect(readFileSync(join(root, 'src', 'view.css'), 'utf8')).toBe('.facts-panel { gap: 1px; }\n.facts-panel__group { --facts-panel-value-max-w: 9rem; }\n.facts-panel__fact { color: red; }\n');
    expect(run.todos).toEqual([]);
    const again = await runMigrations(root, [...only('progress-bar-tone'), ...only('facts-panel-names')]);
    expect(again.applied.flatMap((m) => m.touched)).toEqual([]);
  });

  it('leaves to-dos for the Badge status word, AboutPanel onCopy, PortalDocumentContext, the removed title bar props and toDropdownItems', async () => {
    const root = sample();
    const ids = ['badge-status', 'tessera-provider-overrides', 'window-title-bar-config', 'dropdown-menu-groups'];
    const run = await runMigrations(root, ids.flatMap(only));
    expect(readFileSync(join(root, 'src', 'view.tsx'), 'utf8')).toBe(TESSERA_VIEW);
    expect(run.todos.map(({ migration, file, line }) => `${migration} ${file}:${line}`)).toEqual([
      'badge-status src/view.tsx:10',
      'tessera-provider-overrides src/view.tsx:12',
      'tessera-provider-overrides src/view.tsx:2',
      'tessera-provider-overrides src/view.tsx:13',
      'tessera-provider-overrides src/view.tsx:13',
      'window-title-bar-config src/view.tsx:14',
      'window-title-bar-config src/view.tsx:14',
      'window-title-bar-config src/view.tsx:14',
      'dropdown-menu-groups src/menu.ts:1',
      'dropdown-menu-groups src/menu.ts:2',
    ]);
    expect(run.todos.find((todo) => todo.migration === 'window-title-bar-config')?.message).toContain('menuOpen');
  });
});
