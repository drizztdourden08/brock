/* @layer renderer-shell @kind logic */
import { MAIN_NODE, createDefaultLayout, createPane, getWidgetDefinition, openWidget, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, SplitAxis, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { LAYOUT_MAIN } from './widget.constants';
import type { LayoutCell, LayoutPreset, SizedNode } from './layout-preset.type';
import type { WidgetDef } from './widget.type';

const shares = (sizes: readonly (number | undefined)[]): number[] => {
  const given = sizes.filter((size): size is number => size !== undefined && size > 0);
  const fill = given.length > 0 ? given.reduce((sum, size) => sum + size, 0) / given.length : 1;
  const all = sizes.map((size) => (size !== undefined && size > 0 ? size : fill));
  const total = all.reduce((sum, size) => sum + size, 0);
  return all.map((size) => size / total);
};

const joined = (axis: SplitAxis, parts: readonly SizedNode[]): LayoutNode | null => {
  const [only] = parts;
  if (parts.length <= 1) return only?.node ?? null;
  return { kind: 'split', axis, children: parts.map((part) => part.node), sizes: shares(parts.map((part) => part.size)) };
};

const builder = (definitions: readonly WidgetDef[]) => {
  const placed = new Set<string>();
  const take = (id: string): boolean => {
    if (placed.has(id) || (id !== LAYOUT_MAIN && !getWidgetDefinition(definitions, id))) return false;
    placed.add(id);
    return true;
  };
  const cell = (entry: LayoutCell): LayoutNode | null => {
    const ids = (typeof entry === 'string' ? [entry] : [...entry]).filter(take);
    if (ids.includes(LAYOUT_MAIN)) return MAIN_NODE;
    return ids.length > 0 ? createPane(ids) : null;
  };
  const row = (cells: readonly LayoutCell[], widths: readonly number[] = []): LayoutNode | null =>
    joined('row', cells.flatMap((entry, index) => {
      const node = cell(entry);
      return node ? [{ node, size: widths[index] }] : [];
    }));
  return { row, hasMain: () => placed.has(LAYOUT_MAIN) };
};

const presetDock = (preset: LayoutPreset, definitions: readonly WidgetDef[]): LayoutNode => {
  const build = builder(definitions);
  const rows = preset.rows.flatMap((cells, index) => {
    const node = build.row(cells, preset.widths?.[index]);
    return node ? [{ node, size: preset.sizes?.[index] }] : [];
  });
  const withMain = build.hasMain() ? rows : [...rows, { node: MAIN_NODE, size: undefined }];
  return joined('column', withMain) ?? MAIN_NODE;
};

const presetLayout = (preset: LayoutPreset | null, definitions: readonly WidgetDef[]): WidgetLayout => {
  const base: WidgetLayout = { ...createDefaultLayout(), dock: preset ? presetDock(preset, definitions) : MAIN_NODE };
  const placed = new Set(widgetsIn(base.dock));
  return definitions
    .filter((def) => def.defaultOpen === true && !placed.has(def.id))
    .reduce((layout, def) => openWidget(layout, def.id, definitions), base);
};

export { presetLayout };
