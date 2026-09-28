/* @layer electron-main @kind constants */
import type { UpdaterPrefs } from '../updater.type';

const MODULE_ID = 'updater';
const DATA_DIR = 'updater';
const PREFS_FILE = `${DATA_DIR}/prefs.json`;
const DEFAULT_PREFS: UpdaterPrefs = { allowPrerelease: false };

const FIRST_CHECK_DELAY_MS = 5000;
const MAX_DELTAS = 10;
const RELEASE_PAGE_SIZE = 30;

const GITHUB_WEB = 'https://github.com';
const GITHUB_API = 'https://api.github.com';
const GITHUB_JSON = { Accept: 'application/vnd.github.v3+json' };
const API_ORIGIN_SUFFIX = '_UPDATE_API_ORIGIN';
const UPDATE_SOURCE_FLAG = '--update-source';
const RELEASE_TAG_PREFIX = 'v';

const CHANNEL_BY_PLATFORM: Partial<Record<NodeJS.Platform, string>> = {
  win32: 'win',
  darwin: 'osx',
  linux: 'linux',
};

export {
  MODULE_ID, DATA_DIR, PREFS_FILE, DEFAULT_PREFS, FIRST_CHECK_DELAY_MS, MAX_DELTAS, RELEASE_PAGE_SIZE,
  GITHUB_WEB, GITHUB_API, GITHUB_JSON, API_ORIGIN_SUFFIX, UPDATE_SOURCE_FLAG, RELEASE_TAG_PREFIX,
  CHANNEL_BY_PLATFORM,
};
