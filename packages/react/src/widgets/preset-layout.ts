/* @layer renderer-shell @kind logic */
import { MAIN_NODE, createDefaultLayout, createPane, getWidgetDefinition, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, SplitAxis, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { openOrdered } from './open-ordered';
import { LAYOUT_MAIN, UNDER_MAIN_MIN, UNDER_MAIN_SHARE } from './widget.constants';
import type { LayoutCell, LayoutColumn, LayoutPane, LayoutPreset, LayoutRowDef, SizedNode } from './layout-preset.type';
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

const isColumn = (entry: LayoutCell): entry is LayoutColumn => typeof entry === 'object' && 'column' in entry;

const idsOf = (entry: LayoutCell): string[] => {
  if (typeof entry === 'string') return [entry];
  return isColumn(entry) ? entry.column.flatMap(idsOf) : [...entry];
};

const weightOf = (ids: readonly string[], definitions: readonly WidgetDef[]): number | undefined => {
  const weights = ids.flatMap((id) => {
    const weight = getWidgetDefinition(definitions, id)?.dockWeight;
    return weight !== undefined && weight > 0 ? [weight] : [];
  });
  return weights.length > 0 ? Math.max(...weights) : undefined;
};

const cellsOf = (row: LayoutRowDef): readonly LayoutCell[] => ('cells' in row ? row.cells : row);

const isUnder = (row: LayoutRowDef): boolean => 'cells' in row && row.under === 'main';

const replaceMain = (node: LayoutNode, replacement: LayoutNode): LayoutNode => {
  if (node.kind === 'main') return replacement;
  if (node.kind !== 'split') return node;
  return { ...node, children: node.children.map((child) => replaceMain(child, replacement)) };
};

const underMain = (node: LayoutNode, under: readonly SizedNode[]): LayoutNode => {
  if (under.length === 0) return node;
  const sizes = under.map((part) => (part.size !== undefined && part.size > 0 ? part.size : UNDER_MAIN_SHARE));
  const main = Math.max(1 - sizes.reduce((sum, size) => sum + size, 0), UNDER_MAIN_MIN);
  const stack = joined('column', [{ node: MAIN_NODE, size: main }, ...under.map((part, index) => ({ node: part.node, size: sizes[index] }))]);
  return replaceMain(node, stack ?? MAIN_NODE);
};

const builder = (definitions: readonly WidgetDef[]) => {
  const placed = new Set<string>();
  const take = (id: string): boolean => {
    if (placed.has(id) || (id !== LAYOUT_MAIN && !getWidgetDefinition(definitions, id))) return false;
    placed.add(id);
    return true;
  };
  const pane = (entry: LayoutPane): LayoutNode | null => {
    const ids = (typeof entry === 'string' ? [entry] : [...entry]).filter(take);
    if (ids.includes(LAYOUT_MAIN)) return MAIN_NODE;
    return ids.length > 0 ? createPane(ids) : null;
  };
  const column = (entry: LayoutColumn): LayoutNode | null =>
    joined('column', entry.column.flatMap((member, index) => {
      const made = pane(member);
      return made ? [{ node: made, size: entry.sizes?.[index] ?? weightOf(idsOf(member), definitions) }] : [];
    }));
  const cell = (entry: LayoutCell): LayoutNode | null => (isColumn(entry) ? column(entry) : pane(entry));
  const row = (cells: readonly LayoutCell[], widths: readonly number[] = []): SizedNode | null => {
    const node = joined('row', cells.flatMap((entry, index) => {
      const made = cell(entry);
      return made ? [{ node: made, size: widths[index] }] : [];
    }));
    return node ? { node, size: weightOf(cells.flatMap(idsOf), definitions) } : null;
  };
  return { row, hasMain: () => placed.has(LAYOUT_MAIN) };
};

const presetDock = (preset: LayoutPreset, definitions: readonly WidgetDef[]): LayoutNode => {
  const build = builder(definitions);
  const full: SizedNode[] = [];
  const under: SizedNode[] = [];
  preset.rows.forEach((def, index) => {
    const made = build.row(cellsOf(def), preset.widths?.[index]);
    if (made) (isUnder(def) ? under : full).push({ node: made.node, size: preset.sizes?.[index] ?? made.size });
  });
  const withMain = build.hasMain() ? full : [...full, { node: MAIN_NODE, size: undefined }];
  return underMain(joined('column', withMain) ?? MAIN_NODE, under);
};

const presetLayout = (preset: LayoutPreset | null, definitions: readonly WidgetDef[]): WidgetLayout => {
  const base: WidgetLayout = { ...createDefaultLayout(), dock: preset ? presetDock(preset, definitions) : MAIN_NODE };
  const placed = new Set(widgetsIn(base.dock));
  return definitions
    .filter((def) => def.defaultOpen === true && !placed.has(def.id))
    .reduce((layout, def) => openOrdered(layout, def.id, definitions), base);
};

export { presetLayout };
