/* @layer core @kind constants */
import type { AppState } from './app-state.type';

const APP_STATE_FILE = 'app.json';
const DEFAULT_APP_STATE: AppState = { lastProfileId: null };

export { APP_STATE_FILE, DEFAULT_APP_STATE };
