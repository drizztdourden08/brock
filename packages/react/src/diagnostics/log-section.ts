/* @layer renderer-shell @kind logic */
import { redactSecrets } from '@drizztdourden08/brock-core';
import type { LogEntry } from '@drizztdourden08/brock-core';
import { debugSection } from './debug-section';
import { DEBUG_LOG_LINE_MAX, DEBUG_LOG_TAIL } from './diagnostics.constants';
import type { DebugSection } from './diagnostics.type';
import { formatLogLine } from './format-log-line';

const logSection = (entries: readonly LogEntry[], tail = DEBUG_LOG_TAIL): DebugSection => {
  const recent = entries.slice(-tail);
  return debugSection(`Recent log (${recent.length} of ${entries.length})`, recent.map((entry) => formatLogLine({ ...entry, message: redactSecrets(entry.message) }, DEBUG_LOG_LINE_MAX)));
};

export { logSection };
