/* @layer core @kind logic */
import type { FileStore } from '../platform/ports/file-store.type';
import type { AppState, AppStateChange } from './app-state.type';
import { DEFAULT_APP_STATE } from './app-state.constants';
import { getAppState } from './get-app-state';
import { saveAppState } from './save-app-state';

const queues = new WeakMap<FileStore, Promise<unknown>>();

const readState = async (files: FileStore): Promise<AppState> => {
  const state: unknown = await getAppState(files);
  return typeof state === 'object' && state !== null && !Array.isArray(state) ? (state as AppState) : DEFAULT_APP_STATE;
};

const applyChange = async (files: FileStore, change: AppStateChange): Promise<AppState> => {
  const current = await readState(files);
  const next = change(current);
  if (next !== current) await saveAppState(files, next);
  return next;
};

const updateAppState = (files: FileStore, change: AppStateChange): Promise<AppState> => {
  const run = (queues.get(files) ?? Promise.resolve()).then(() => applyChange(files, change));
  queues.set(files, run.catch(() => undefined));
  return run;
};

export { updateAppState };
