/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { UpdaterApi } from '../updater.type';

const updaterApi = (): UpdaterApi | null => hostApi()?.updater ?? null;

export { updaterApi };
