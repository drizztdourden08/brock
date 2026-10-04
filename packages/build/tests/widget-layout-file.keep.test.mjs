/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.17.0/widget-layout-prop.mjs';
import { checkWidgets } from '../src/widgets/check-widgets.mjs';
import { renderWidgetsFiles } from '../src/widgets/render-widgets.mjs';

const made = [];

const writeInto = (root) => ([file, text]) => {
  const path = join(root, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
};

const appWith = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-widget-layout-'));
  Object.entries(files).forEach(writeInto(root));
  made.push(root);
  return root;
};

const LAYOUT = "import { defineLayoutPreset } from '@drizztdourden08/brock-react';\n\nexport default defineLayoutPreset({ rows: [['main', 'notes']] });\n";
const NOTES = "const Notes = () => null;\n\nconst meta = { defaultOpen: true };\n\nexport default Notes;\nexport { meta };\n";

const MAIN = [
  "import { BrockApp } from '@drizztdourden08/brock-react';",
  "import { screenTree } from '../.brock/screens';",
  "import { appWidgets } from '../.brock/widgets';",
  '',
  'createRoot(root).render(',
  '  <StrictMode>',
  '    <BrockApp<AppSettings>',
  '      product={product}',
  '      screenTree={screenTree}',
  '      widgets={appWidgets}',
  '    />',
  '  </StrictMode>,',
  ');',
  '',
].join('\n');

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('src/widgets/layout.ts', () => {
  it('is the widget layout, not a stray file, and defaultOpen is a widget field', () => {
    const root = appWith({ 'src/widgets/layout.ts': LAYOUT, 'src/widgets/notes.widget.tsx': NOTES });
    expect(checkWidgets(root)).toEqual([]);
    expect(renderWidgetsFiles(root)[0]?.content).toContain("import appWidgetLayout from '../src/widgets/layout';");
  });

  it('is reported without a default export and left out of the list', () => {
    const root = appWith({ 'src/widgets/layout.ts': 'export const rows = [];\n' });
    expect(checkWidgets(root)).toEqual(['src/widgets/layout.ts: no default export; the layout file default-exports defineLayoutPreset({ rows })']);
    expect(renderWidgetsFiles(root)[0]?.content).toContain('const appWidgetLayout = undefined;');
  });

  it('leaves any other stray file reported', () => {
    expect(checkWidgets(appWith({ 'src/widgets/presets.ts': LAYOUT }))[0]).toContain('src/widgets/presets.ts: not a widget file');
  });
});

describe('the widget-layout-prop migration', () => {
  const run = (source, path = 'src/main.tsx') => migration.apply({ path, source }).source;

  it('passes widgetLayout beside widgets and imports it with appWidgets', () => {
    const source = run(MAIN);
    expect(source).toContain("import { appWidgetLayout, appWidgets } from '../.brock/widgets';");
    expect(source).toContain('      widgets={appWidgets}\n      widgetLayout={appWidgetLayout}\n    />');
  });

  it('changes nothing on a second run or in a file that does not use .brock/widgets', () => {
    const once = run(MAIN);
    expect(run(once)).toBe(once);
    const bare = MAIN.replace("import { appWidgets } from '../.brock/widgets';\n", '');
    expect(run(bare)).toBe(bare);
    expect(run(MAIN, 'src/views/Main.tsx')).toBe(MAIN);
  });

  it('keeps a widgetLayout the app already passes', () => {
    const own = MAIN.replace('      widgets={appWidgets}\n', '      widgets={appWidgets}\n      widgetLayout={MY_LAYOUT}\n');
    const source = run(own);
    expect(source).toContain('widgetLayout={MY_LAYOUT}');
    expect(source).not.toContain('widgetLayout={appWidgetLayout}');
  });
});
