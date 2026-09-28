/* @layer core @kind logic */
import type { FileStore } from '../platform/ports/file-store.type';
import type { AppState } from './app-state.type';
import { APP_STATE_FILE } from './app-state.constants';
import { writeJson } from './write-json';

const saveAppState = (files: FileStore, state: AppState): Promise<void> => writeJson(files, APP_STATE_FILE, state);

export { saveAppState };
