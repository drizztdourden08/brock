/* @layer renderer-shell @kind logic */
import { BROCK_VIEWS_PREFIX } from './ui-views.constants';
import { uiViewsFile } from './ui-views-file';

const appKey = (key: string): string => {
  if (key === '' || key.startsWith(BROCK_VIEWS_PREFIX)) throw new Error(`ui-views key "${key}" is not the app's: keys starting with "${BROCK_VIEWS_PREFIX}" are Brock's`);
  return key;
};

const read = async <T>(key: string, fallback: T): Promise<T> => {
  const all = await uiViewsFile.load();
  const own = appKey(key);
  return own in all ? (all[own] as T) : fallback;
};

const write = async (key: string, value: unknown): Promise<void> => uiViewsFile.set(appKey(key), value);

const remove = async (key: string): Promise<void> => uiViewsFile.set(appKey(key), undefined);

const uiViews = { read, write, remove, flush: uiViewsFile.flush };

export { uiViews };
