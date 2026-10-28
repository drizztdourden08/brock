/* @layer renderer-shell @kind logic */
import { BROCK_VIEWS_PREFIX } from './ui-views.constants';
import { uiViewsFile } from './ui-views-file';
import { configureScopes, scope } from './ui-views-scope';
import { UI_VIEWS_SCOPE_PREFIX } from './ui-views-scope.constants';

const appKey = (key: string): string => {
  if (key === '' || key.startsWith(BROCK_VIEWS_PREFIX)) throw new Error(`ui-views key "${key}" is not the app's: keys starting with "${BROCK_VIEWS_PREFIX}" are Brock's`);
  if (key.startsWith(UI_VIEWS_SCOPE_PREFIX)) throw new Error(`ui-views key "${key}" is not the app's: keys starting with "${UI_VIEWS_SCOPE_PREFIX}" belong to uiViews.scope`);
  return key;
};

const read = async <T>(key: string, fallback: T): Promise<T> => {
  const all = await uiViewsFile.load();
  const own = appKey(key);
  return own in all ? (all[own] as T) : fallback;
};

const write = async (key: string, value: unknown): Promise<void> => uiViewsFile.set(appKey(key), value);

const remove = async (key: string): Promise<void> => uiViewsFile.set(appKey(key), undefined);

const uiViews = { read, write, remove, scope, scopeLimits: configureScopes, flush: uiViewsFile.flush };

export { uiViews };
