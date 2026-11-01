/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkWidgets } from '../src/widgets/check-widgets.mjs';
import { renderWidgetsFiles } from '../src/widgets/render-widgets.mjs';

const made = [];

const appWith = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-widget-kits-'));
  for (const [file, text] of Object.entries(files)) {
    const path = join(root, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  made.push(root);
  return root;
};

const KIT = "const kit = { label: 'Shadow editor', devOnly: true, requires: { context: 'game', reason: 'Start the game first.' } };\n\nexport default kit;\n";
const MEMBER = "const Tree = () => null;\n\nconst meta = { kit: 'shadow' };\n\nexport default Tree;\nexport { meta };\n";
const OVERLAY = "const Gizmo = () => null;\n\nconst meta = { kit: 'shadow', label: 'Gizmo' };\n\nexport default Gizmo;\nexport { meta };\n";

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('K1 kit files in src/widgets', { tags: ['critical'] }, () => {
  it('accepts a kit, its overlay and a widget that joins it, and lists the member with the widgets', () => {
    const root = appWith({ 'src/widgets/shadow.kit.ts': KIT, 'src/widgets/shadow-tree.widget.tsx': MEMBER, 'src/widgets/shadow-gizmo.overlay.tsx': OVERLAY, 'src/widgets/shadow.kit.constants.ts': 'export const A = 1;\n' });
    expect(checkWidgets(root)).toEqual([]);
    const [widgets, kits] = renderWidgetsFiles(root);
    expect(widgets?.content).toContain("id: 'shadow-tree'");
    expect(kits?.content).toContain("{ id: 'shadow', meta: shadowKit }");
    expect(kits?.content).toContain("id: 'shadow-gizmo'");
  });

  it('reports a kit without a default export, an unknown kit field, an overlay without meta and a widget naming a missing kit', () => {
    const root = appWith({
      'src/widgets/broken.kit.ts': 'export const kit = {};\n',
      'src/widgets/odd.kit.ts': "const kit = { label: 'Odd', colour: 'red' };\n\nexport default kit;\n",
      'src/widgets/loose.overlay.tsx': 'const Loose = () => null;\n\nexport default Loose;\n',
      'src/widgets/lost.widget.tsx': MEMBER,
    });
    expect(checkWidgets(root)).toEqual([
      'src/widgets/lost.widget.tsx: meta.kit names "shadow", but there is no src/widgets/shadow.kit.ts',
      'src/widgets/broken.kit.ts: no default export; a kit file default-exports its WidgetKitMeta ({ label, icon, devOnly, requires, layout })',
      'src/widgets/odd.kit.ts: kit.colour is not a kit field (label, icon, order, devOnly, requires, layout, menu, when)',
      'src/widgets/loose.overlay.tsx: no meta; an overlay exports meta = { kit } naming the kit it belongs to',
    ]);
  });
});

describe('K1 menu placement in widget and kit files', { tags: ['critical'] }, () => {
  it('accepts a menu placement and reports an unknown field or a wrong value', () => {
    const placed = "const Tool = () => null;\n\nconst meta = { menu: { parent: 'audio-tools', group: 'modules', order: 1 } };\n\nexport default Tool;\nexport { meta };\n";
    expect(checkWidgets(appWith({ 'src/widgets/tool.widget.tsx': placed, 'src/widgets/paint.kit.ts': "const kit = { menu: { parent: 'widgets-developer' } };\n\nexport default kit;\n" }))).toEqual([]);
    const root = appWith({
      'src/widgets/odd.widget.tsx': "const Odd = () => null;\n\nconst meta = { menu: { parent: '', where: 'top' } };\n\nexport default Odd;\nexport { meta };\n",
      'src/widgets/flat.kit.ts': "const kit = { menu: 'Tools' };\n\nexport default kit;\n",
      'src/widgets/late.kit.ts': "const kit = { menu: { group: 'last', order: 'first' } };\n\nexport default kit;\n",
    });
    expect(checkWidgets(root)).toEqual([
      'src/widgets/odd.widget.tsx: meta.menu.parent must be a submenu key',
      'src/widgets/odd.widget.tsx: meta.menu.where is not a menu placement field (parent, group, order)',
      'src/widgets/flat.kit.ts: kit.menu must be an object ({ parent, group, order })',
      "src/widgets/late.kit.ts: kit.menu.group must be 'main', 'sections', 'modules', 'end'",
      'src/widgets/late.kit.ts: kit.menu.order must be a number',
    ]);
  });
});
