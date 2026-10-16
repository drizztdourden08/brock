/* @layer renderer-shell @kind logic */
import { applyAnchors } from './apply-anchors';
import { applyOrder } from './apply-order';
import { applyParents } from './apply-parents';
import { configOverrides } from './config-overrides';
import { VIEW_MENU_KEY } from './menu-config.constants';
import type { MenuEntryOverride, MenuForest, MenuIssue, MenuOverrideRecord, MenuResolveInput, ResolvedMenu } from './menu-config.type';
import { growForest } from './grow-forest';
import { plantForest } from './plant-forest';
import type { MenuItem } from './menu.type';
import { sanitizeOverride } from './sanitize-override';

const ownOverride = (item: MenuItem): MenuEntryOverride => {
  const { hidden, inMenu, group, order, before, after, parent } = item;
  return { hidden, inMenu, group, order, before, after, parent };
};

const relabel = (item: MenuItem, override: MenuEntryOverride): MenuItem => {
  const { hidden, inMenu, ...rest } = item;
  const gone = override.hidden ?? hidden;
  const listed = override.inMenu ?? inMenu;
  return { ...rest, label: override.label ?? item.label, ...(gone === undefined ? {} : { hidden: gone }), ...(listed === undefined ? {} : { inMenu: listed }) };
};

const routeOf = (item: MenuItem): Pick<MenuOverrideRecord, 'route'> => (item.screen === undefined ? {} : { route: item.screen });

const applyOverrides = (forest: MenuForest, given: ReadonlyMap<string, MenuEntryOverride>, issues: MenuIssue[]): MenuOverrideRecord[] => {
  const records = new Map<string, MenuOverrideRecord>();
  for (const node of forest.nodes) {
    if (node.item === null) continue;
    const { key } = node.item;
    node.override = { ...sanitizeOverride(key, ownOverride(node.item), issues), ...given.get(key) };
    if (Object.keys(node.override).length === 0) continue;
    node.item = relabel(node.item, node.override);
    if (!records.has(key)) records.set(key, { key, label: node.item.label, override: node.override, ...routeOf(node.item) });
  }
  return [...records.values()];
};

const resolveMenu = ({ groups, config, known }: MenuResolveInput): ResolvedMenu => {
  const issues: MenuIssue[] = [];
  const forest = plantForest(groups);
  const keys = new Set([...(known ?? []), ...forest.byKey.keys(), VIEW_MENU_KEY]);
  const overrides = applyOverrides(forest, configOverrides(config, keys, issues), issues);
  applyParents(forest, keys, issues);
  applyOrder(forest);
  applyAnchors(forest, keys, issues);
  return { entries: growForest(forest), issues, overrides };
};

export { resolveMenu };
