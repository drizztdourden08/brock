/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import { foldText } from '../../search/fold-text';
import type { SearchEntry } from '../../search/search.type';
import { WIDGET_KEY_PREFIX } from '../../widgets/widget.constants';
import type { WidgetDef } from '../../widgets/widget.type';
import { isMenuItem } from '../menu/is-menu-item';
import { SEARCH_SETTINGS_PAGES } from '../review.constants';
import type { ReviewEnv, SearchSample } from '../review.type';

const menuLeaves = (menu: readonly MenuEntry[]): MenuItem[] =>
  menu.filter(isMenuItem).flatMap((item) => (item.children ? menuLeaves(item.children) : [item]));

const indexSample = (source: string, entry: SearchEntry | undefined): SearchSample[] =>
  entry === undefined ? [] : [{ source, label: entry.label, target: entry.target }];

const settingSamples = (index: readonly SearchEntry[], unique: (label: string) => boolean): SearchSample[] => {
  const rows = index.filter((entry) => entry.kind === 'setting' && unique(entry.label));
  const routes = [...new Set(rows.map((entry) => entry.target?.route ?? ''))].slice(0, SEARCH_SETTINGS_PAGES);
  return routes.flatMap((route) => indexSample(`setting ${route}`, rows.find((entry) => entry.target?.route === route)));
};

const searchSamples = (env: ReviewEnv, widgetDefs: readonly WidgetDef[]): SearchSample[] => {
  const index = (env.screenTree?.search ?? []).filter((entry) => entry.devOnly !== true || env.developerTools);
  const routes = new Set(index.map((entry) => entry.target?.route));
  const leaves = menuLeaves(env.menu).filter((item) => !item.key.startsWith(WIDGET_KEY_PREFIX) && !routes.has(item.screen));
  const widgets = widgetDefs.filter((def) => def.devOnly !== true || env.developerTools);
  const labels = [...index, ...leaves, ...widgets].map((item) => foldText(item.label));
  const unique = (label: string): boolean => labels.filter((candidate) => candidate === foldText(label)).length === 1;
  const first = (kind: SearchEntry['kind']): SearchEntry | undefined => index.find((entry) => entry.kind === kind && unique(entry.label));
  const widget = widgets.find((def) => unique(def.label));
  const menu = leaves.find((item) => item.screen !== undefined && unique(item.label));
  return [
    ...indexSample('page', first('page')),
    ...indexSample('tab', first('tab')),
    ...settingSamples(index, unique),
    ...indexSample('custom page entry', first('entry')),
    ...(widget ? [{ source: 'widget', label: widget.label, widget: widget.id }] : []),
    ...(menu?.screen ? [{ source: 'menu entry', label: menu.label, target: { route: menu.screen } }] : []),
  ];
};

export { searchSamples };
