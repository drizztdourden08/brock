/* @layer renderer-shell @kind constants */
const SESSION_LOG_FLUSH_MS = 1000;

const SESSION_LOG_BATCH = 50;

const SESSION_LOG_FLUSH_EVENTS = ['pagehide', 'beforeunload'] as const;

export { SESSION_LOG_BATCH, SESSION_LOG_FLUSH_EVENTS, SESSION_LOG_FLUSH_MS };
