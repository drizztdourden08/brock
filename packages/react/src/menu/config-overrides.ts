/* @layer renderer-shell @kind logic */
import { KEY_SUGGESTIONS, VIEW_MENU_KEY } from './menu-config.constants';
import type { MenuConfig, MenuEntryOverride, MenuIssue } from './menu-config.type';
import { sanitizeOverride } from './sanitize-override';

const unknownKey = (key: string, known: ReadonlySet<string>): MenuIssue => {
  const near = [...known].filter((candidate) => candidate.endsWith(`:${key}`) || candidate.includes(key)).slice(0, KEY_SUGGESTIONS);
  const hint = near.length > 0 ? `; did you mean ${near.map((candidate) => `"${candidate}"`).join(' or ')}?` : '';
  return { key, message: `menu.entries names "${key}", but no menu entry has that key${hint}` };
};

const viewOverride = (override: MenuEntryOverride, issues: MenuIssue[]): MenuEntryOverride => {
  const { parent, ...kept } = override;
  if (parent !== undefined) issues.push({ key: VIEW_MENU_KEY, message: 'menu.entries.view sets parent, but the View sub-menu sits at the top level of the menu and takes no parent' });
  return kept;
};

const entriesOf = (config: MenuConfig | undefined, issues: MenuIssue[]): [string, unknown][] => {
  const entries: unknown = config?.entries;
  if (entries === undefined) return [];
  if (typeof entries === 'object' && entries !== null && !Array.isArray(entries)) return Object.entries(entries);
  issues.push({ key: '', message: 'menu.entries must be an object keyed by menu entry key' });
  return [];
};

const configOverrides = (config: MenuConfig | undefined, known: ReadonlySet<string>, issues: MenuIssue[]): Map<string, MenuEntryOverride> => {
  const overrides = new Map<string, MenuEntryOverride>();
  for (const [key, raw] of entriesOf(config, issues)) {
    const override = sanitizeOverride(key, raw, issues);
    if (key !== VIEW_MENU_KEY && !known.has(key)) issues.push(unknownKey(key, known));
    overrides.set(key, key === VIEW_MENU_KEY ? viewOverride(override, issues) : override);
  }
  return overrides;
};

export { configOverrides };
