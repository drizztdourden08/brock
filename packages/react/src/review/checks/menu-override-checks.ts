/* @layer renderer-shell @kind logic */
import type { MenuOverrideRecord } from '../../menu/menu-config.type';
import type { MenuEntry } from '../../menu/menu.type';
import { isMenuItem } from '../menu/is-menu-item';
import { menuPathTo } from '../menu/menu-path-to';
import type { MenuPanelOf, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const outOfMenu = (record: MenuOverrideRecord): boolean => record.override.hidden === true || record.override.inMenu === false;

const hiddenOutcome = (record: MenuOverrideRecord, menu: readonly MenuEntry[], top: readonly string[] | null, ignored: readonly string[]): ReviewOutcome => {
  const inModel = menuPathTo(menu, (item) => item.key === record.key) !== null;
  const twin = ignored.includes(record.label) || menu.filter(isMenuItem).some((item) => item.label === record.label);
  const shown = inModel || (!twin && (top ?? []).includes(record.label));
  const how = record.override.hidden === true ? 'hidden' : 'out of the menu';
  return outcome(`menu-entry-${record.key}`, !shown, `"${record.label}" (${record.key}) is ${how}`, `"${record.label}" (${record.key}) is ${how} by the config but shows in the menu`);
};

const siblingsAt = (menu: readonly MenuEntry[], parents: readonly string[]): string[] => {
  let list = menu.filter(isMenuItem);
  for (const label of parents) list = (list.find((item) => item.label === label)?.children ?? []).filter(isMenuItem);
  return list.map((item) => item.label);
};

const neighbours = (list: readonly string[], label: string): string => {
  const at = list.indexOf(label);
  return `${list[at - 1] ?? '(start)'} | ${list[at + 1] ?? '(end)'}`;
};

const placedOutcome = (record: MenuOverrideRecord, menu: readonly MenuEntry[], panelOf: MenuPanelOf): ReviewOutcome => {
  const id = `menu-entry-${record.key}`;
  const path = menuPathTo(menu, (item) => item.key === record.key);
  if (path === null) return outcome(id, false, '', `"${record.label}" (${record.key}) has no place in the drawn menu`);
  const label = path.at(-1) ?? record.label;
  const parents = path.slice(0, -1);
  const panel = panelOf(parents) ?? [];
  const where = path.join(' > ');
  if (!panel.includes(label)) return outcome(id, false, '', `the menu shows no "${where}" for ${record.key}`);
  const siblings = siblingsAt(menu, parents);
  const wanted = neighbours(siblings, label);
  const shown = neighbours(panel.filter((entry) => siblings.includes(entry)), label);
  return outcome(id, wanted === shown, `"${record.key}" shows as ${where}, between ${wanted}`, `"${record.key}" shows as ${where} between ${shown}, not between ${wanted}`);
};

const menuOverrideChecks = (records: readonly MenuOverrideRecord[], menu: readonly MenuEntry[], panelOf: MenuPanelOf, ignored: readonly string[] = []): ReviewOutcome[] =>
  records.map((record) => (outOfMenu(record) ? hiddenOutcome(record, menu, panelOf([]), ignored) : placedOutcome(record, menu, panelOf)));

export { menuOverrideChecks };
