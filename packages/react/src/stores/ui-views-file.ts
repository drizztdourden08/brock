/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';
import { hostApi } from '../host/host-api';
import { UI_VIEWS_SAVE_DELAY_MS } from './ui-views.constants';

let cache: Record<string, unknown> | null = null;
let loading: Promise<Record<string, unknown>> | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const dirty = new Set<string>();

const fetchAll = async (): Promise<Record<string, unknown>> => {
  const api = hostApi();
  try {
    const data = api ? await api.loadUiViews() : {};
    return isRecord(data) ? data : {};
  } catch {
    return {};
  }
};

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
  const api = hostApi();
  const write = api?.patchUiViews ? api.patchUiViews(changedEntries(cache)) : api?.saveUiViews(cache);
  dirty.clear();
  write?.catch(() => undefined);
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
