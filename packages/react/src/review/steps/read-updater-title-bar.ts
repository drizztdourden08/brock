/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { find } from '../dom/find';
import { SELECTORS } from '../review.constants';
import type { UpdaterTitleBarSnapshot } from '../review.type';

const readUpdaterTitleBar = async (): Promise<UpdaterTitleBarSnapshot> => {
  const appVersion = await requireHostApi().getAppVersion();
  const text = find(SELECTORS.titleBar)?.textContent ?? '';
  return {
    versionShown: find(SELECTORS.versionTag) !== null || (appVersion.length > 0 && text.includes(appVersion)),
    statusShown: find(SELECTORS.updateStatus) !== null,
  };
};

export { readUpdaterTitleBar };
