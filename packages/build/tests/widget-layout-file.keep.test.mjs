/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
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

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('K1 src/widgets/layout.ts', { tags: ['critical'] }, () => {
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
});
