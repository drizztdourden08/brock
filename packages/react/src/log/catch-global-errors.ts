/* @layer renderer-shell @kind logic */
import { isBenignBrowserError } from '@drizztdourden08/brock-core';
import type { AppLogBus } from './app-log.type';
import { describeError } from './describe-error';
import type { EventTargetLike } from './session-log.type';

const where = (event: ErrorEvent): string => (event.filename ? ` (${event.filename}:${event.lineno}:${event.colno})` : '');

const catchGlobalErrors = (bus: AppLogBus, target: EventTargetLike): (() => void) => {
  const onError = (event: ErrorEvent): void => {
    if (isBenignBrowserError(event.message)) {
      event.preventDefault();
      bus.log('app', `Browser warning: ${event.message}`, 'warn');
      return;
    }
    bus.error(`Uncaught error${where(event)}: ${event.error === undefined || event.error === null ? event.message : describeError(event.error)}`);
  };
  const onRejection = (event: PromiseRejectionEvent): void => {
    bus.error(`Unhandled promise rejection: ${describeError(event.reason)}`);
  };
  target.addEventListener('error', onError);
  target.addEventListener('unhandledrejection', onRejection);
  return () => {
    target.removeEventListener('error', onError);
    target.removeEventListener('unhandledrejection', onRejection);
  };
};

export { catchGlobalErrors };
