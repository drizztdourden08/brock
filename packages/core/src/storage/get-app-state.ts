/* @layer core @kind logic */
import type { FileStore } from '../platform/ports/file-store.type';
import type { AppState } from './app-state.type';
import { APP_STATE_FILE, DEFAULT_APP_STATE } from './app-state.constants';
import { readJson } from './read-json';

const getAppState = (files: FileStore): Promise<AppState> => readJson(files, APP_STATE_FILE, DEFAULT_APP_STATE);

export { getAppState };
