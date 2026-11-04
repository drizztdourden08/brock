/* @layer renderer-shell @kind logic */
import { DEFAULT_REFRESH_HZ } from '../game-info.constants';
import { readStoredPref } from './read-stored-pref';

const readRefreshHz = (): number => {
  const hz = Number(readStoredPref('refreshHz'));
  return Number.isFinite(hz) && hz > 0 ? hz : DEFAULT_REFRESH_HZ;
};

export { readRefreshHz };
