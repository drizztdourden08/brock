/* @layer renderer-shell @kind constants */
import type { Returns } from './api-shim.type';

const BASE_LIST_METHODS = ['listProfiles', 'listSessions', 'fileList', 'listJobs', 'listDataDomains', 'domainList'];

const BASE_RETURNS: Returns = {
  getAppState: () => ({ lastProfileId: null }),
  getAppVersion: () => '0.0.0',
  loadUiViews: () => ({}),
  fileExists: () => false,
  isMaximized: () => false,
  isFullscreen: () => false,
  setAlwaysOnTop: () => false,
  getDataLocation: () => ({ path: '(browser)', osLabel: 'Browser', canReveal: false }),
  getStorageSummary: () => ({ location: { path: '(browser)', osLabel: 'Browser', canReveal: false }, domains: [], totalBytes: 0 }),
  revealProfileFolder: () => ({ success: false, error: 'Not available on this host' }),
  openFolder: () => ({ success: false, error: 'Not available on this host' }),
  revealPath: () => ({ success: false, error: 'Not available on this host' }),
  saveFile: () => ({ saved: false }),
};

export { BASE_LIST_METHODS, BASE_RETURNS };
