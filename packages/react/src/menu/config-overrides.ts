/* @layer renderer-shell @kind logic */
import { KEY_SUGGESTIONS, VIEW_MENU_KEY } from './menu-config.constants';
import type { MenuConfig, MenuEntryOverride, MenuIssue } from './menu-config.type';
import { sanitizeOverride } from './sanitize-override';

const unknownKey = (key: string, known: ReadonlySet<string>): MenuIssue => {
  const near = [...known].filter((candidate) => candidate.endsWith(`:${key}`) || candidate.includes(key)).slice(0, KEY_SUGGESTIONS);
  const hint = near.length > 0 ? `; did you mean ${near.map((candidate) => `"${candidate}"`).join(' or ')}?` : '';
  return { key, message: `menu.entries names "${key}", but no menu entry has that key${hint}` };
};

const viewIssues = (override: MenuEntryOverride): MenuIssue[] =>
  Object.keys(override).filter((field) => field !== 'label').map((field) => ({
    key: VIEW_MENU_KEY,
    message: `menu.entries.view sets ${field}, but the View sub-menu is drawn by the title bar itself and only takes a label`,
  }));

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
    if (key === VIEW_MENU_KEY) issues.push(...viewIssues(override));
    else if (!known.has(key)) issues.push(unknownKey(key, known));
    overrides.set(key, override);
  }
  return overrides;
};

export { configOverrides };
