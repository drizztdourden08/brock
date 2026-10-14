/* @layer renderer-shell @kind logic */
import type { AppLogBus } from './app-log.type';
import type { AppendLines, EventTargetLike } from './session-log.type';
import { SESSION_LOG_BATCH, SESSION_LOG_FLUSH_EVENTS, SESSION_LOG_FLUSH_MS } from './session-log.constants';
import { sessionLogLine } from './session-log-line';

const writeSessionLog = (bus: AppLogBus, append: AppendLines, target: EventTargetLike | null): (() => void) => {
  let pending: string[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;
  const flush = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    if (pending.length === 0) return;
    const lines = pending;
    pending = [];
    append(lines);
  };
  const stop = bus.subscribe((entry) => {
    pending.push(sessionLogLine(entry));
    if (pending.length >= SESSION_LOG_BATCH) flush();
    else timer ??= setTimeout(flush, SESSION_LOG_FLUSH_MS);
  });
  for (const name of SESSION_LOG_FLUSH_EVENTS) target?.addEventListener(name, flush);
  return () => {
    stop();
    for (const name of SESSION_LOG_FLUSH_EVENTS) target?.removeEventListener(name, flush);
    flush();
  };
};

export { writeSessionLog };
