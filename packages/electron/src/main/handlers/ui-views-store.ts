/* @layer electron-main @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { readJson, writeJson } from '@drizztdourden08/brock-core/storage';
import { UI_VIEWS_FILE } from './ui-views-handlers.constants';
import type { UiViewsStore, Views } from './ui-views-store.type';

const isRecord = (value: unknown): value is Views => typeof value === 'object' && value !== null && !Array.isArray(value);

const mergeEntries = (current: Views, entries: Views): Views => {
  const next = { ...current };
  for (const [key, value] of Object.entries(entries)) {
    if (value === null || value === undefined) Reflect.deleteProperty(next, key);
    else next[key] = value;
  }
  return next;
};

const createUiViewsStore = (files: FileStore): UiViewsStore => {
  let queue: Promise<unknown> = Promise.resolve();
  const serial = <T>(work: () => Promise<T>): Promise<T> => {
    const run = queue.then(work, work);
    queue = run.catch(() => undefined);
    return run;
  };
  const load = async (): Promise<Views> => {
    const data = await readJson<unknown>(files, UI_VIEWS_FILE, {});
    return isRecord(data) ? data : {};
  };
  return {
    load: () => serial(load),
    save: (data: Views) => serial(() => writeJson(files, UI_VIEWS_FILE, data)),
    patch: (entries: Views) => serial(async () => writeJson(files, UI_VIEWS_FILE, mergeEntries(await load(), entries))),
  };
};

export { createUiViewsStore };
