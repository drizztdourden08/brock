/* @layer renderer-shell @kind logic */
import { UI_VIEWS_SAVE_DELAY_MS } from './ui-views.constants';
import { uiViewsSource } from './ui-views-source';
import type { UiViewsSource } from './ui-views.type';

let cache: Record<string, unknown> | null = null;
let loading: Promise<Record<string, unknown>> | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let picked: UiViewsSource | null = null;
const dirty = new Set<string>();

const source = (): UiViewsSource => {
  picked ??= uiViewsSource();
  return picked;
};

const fetchAll = (): Promise<Record<string, unknown>> => source().load().catch(() => ({}));

const load = (): Promise<Record<string, unknown>> => {
  if (cache) return Promise.resolve(cache);
  loading ??= fetchAll().then((data) => {
    cache = data;
    return data;
  });
  return loading;
};

const changedEntries = (all: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries([...dirty].map((key) => [key, key in all ? all[key] : null]));

const flush = (): void => {
  if (timer !== null) clearTimeout(timer);
  timer = null;
  if (dirty.size === 0 || !cache) return;
  const changed = changedEntries(cache);
  dirty.clear();
  source().save({ ...cache }, changed).catch(() => undefined);
};

const touch = (key: string): void => {
  dirty.add(key);
  if (timer !== null) clearTimeout(timer);
  timer = setTimeout(flush, UI_VIEWS_SAVE_DELAY_MS);
};

const put = (all: Record<string, unknown>, key: string, value: unknown): void => {
  if (value === undefined) Reflect.deleteProperty(all, key);
  else all[key] = value;
  touch(key);
};

const set = (key: string, value: unknown): Promise<void> => {
  if (cache) {
    put(cache, key, value);
    return Promise.resolve();
  }
  return load().then((all) => put(all, key, value));
};

const cached = (): Record<string, unknown> | null => cache;

const uiViewsFile = { load, cached, set, touch, flush };

export { uiViewsFile };
