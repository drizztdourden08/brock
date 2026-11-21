/* @layer renderer-shell @kind logic */
import { fallbackText } from '../../i18n/fallback-text';
import { ROUTE_SEPARATOR } from '../../navigation/navigation.constants';
import { SETTING_ID_PREFIX } from '../search.constants';
import type { CatalogInput, SearchEntry } from '../search.type';
import { resolveEntry } from './resolve-entry';
import { settingToggle } from './setting-toggle';

const rootOf = (entry: SearchEntry): string => entry.target?.route.split(ROUTE_SEPARATOR)[0] ?? '';

const withToggle = (entry: SearchEntry, input: CatalogInput): SearchEntry =>
  entry.kind === 'setting' ? { ...entry, toggle: settingToggle(entry.id.slice(SETTING_ID_PREFIX.length), input) } : entry;

const indexEntries = (input: CatalogInput, blocked: ReadonlySet<string>): SearchEntry[] =>
  input.index
    .filter((entry) => entry.devOnly !== true || input.isDev)
    .map((entry) => resolveEntry(entry, input.text ?? fallbackText))
    .filter((entry) => entry.kind === 'screen' || !blocked.has(rootOf(entry)))
    .map((entry) => (entry.kind === 'screen' && blocked.has(rootOf(entry)) ? { ...entry, disabled: true } : withToggle(entry, input)));

export { indexEntries };
