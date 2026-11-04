/* @layer core @kind constants */
const TRACKER_TAGS: readonly string[] = ['Tracker', 'NoText'];
const NO_ITEMS_HANDLING = 0;
const TRACKER_RETRY_MIN_MS = 1000;
const TRACKER_RETRY_MAX_MS = 30000;
const FALLBACK_VERSION = { major: 0, minor: 6, build: 6, class: 'Version' } as const;

export { FALLBACK_VERSION, NO_ITEMS_HANDLING, TRACKER_RETRY_MAX_MS, TRACKER_RETRY_MIN_MS, TRACKER_TAGS };
