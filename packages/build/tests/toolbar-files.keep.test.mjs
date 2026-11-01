/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { checkToolbars } from '../src/toolbars/check-toolbars.mjs';
import { renderToolbars, renderToolbarsFiles } from '../src/toolbars/render-toolbars.mjs';
import { appDirs } from './app-dir-harness.mjs';

const TOOLBAR = "export default defineToolbar({ id: 'drawing-tools', label: 'Drawing tools', defaultSide: 'left', render: (slot) => null });\n";

const { appDir, cleanUp } = appDirs('brock-toolbars-');

afterEach(cleanUp);

describe('K1 renderToolbars', { tags: ['critical'] }, () => {
  it('writes an empty list for an app with no src/toolbars, and skips files with no default export', () => {
    expect(renderToolbarsFiles(appDir({}))).toEqual([{ path: '.brock/toolbars.ts', content: renderToolbars([]) }]);
    expect(renderToolbars([])).toContain('const appToolbars: ToolbarDef[] = [];');
    const dir = appDir({ 'src/toolbars/drawing-tools.toolbar.tsx': TOOLBAR, 'src/toolbars/half.toolbar.tsx': 'const x = 1;\n' });
    expect(renderToolbarsFiles(dir)[0]?.content).toContain("import drawingToolsToolbar from '../src/toolbars/drawing-tools.toolbar';");
    expect(renderToolbarsFiles(dir)[0]?.content).not.toContain('half');
  });
});

describe('K1 checkToolbars', { tags: ['critical'] }, () => {
  it('reports strays, folders, bad ids, missing default exports and an id that differs from the file name', () => {
    const dir = appDir({
      'src/toolbars/drawing-tools.toolbar.tsx': TOOLBAR,
      'src/toolbars/helpers.ts': 'export const y = 1;\n',
      'src/toolbars/parts/a.ts': '',
      'src/toolbars/Bad.toolbar.tsx': 'export default x;\n',
      'src/toolbars/empty.toolbar.tsx': 'const x = 1;\n',
      'src/toolbars/zoom.toolbar.tsx': "export default defineToolbar({ id: 'zoomer', label: 'Zoom', defaultSide: 'top', render: () => null });\n",
    });
    const findings = checkToolbars(dir).join('\n');
    expect(findings).toContain('src/toolbars/helpers.ts: not a toolbar file');
    expect(findings).toContain('src/toolbars/parts: src/toolbars holds toolbar files and their constants files only');
    expect(findings).toContain('"Bad" is not a kebab-case id');
    expect(findings).toContain('src/toolbars/empty.toolbar.tsx: no default export');
    expect(findings).toContain('defineToolbar names id "zoomer", but the file name makes it "zoom"');
    expect(findings).not.toContain('drawing-tools.toolbar.tsx');
  });
});
