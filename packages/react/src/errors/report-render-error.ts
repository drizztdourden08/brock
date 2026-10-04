/* @layer renderer-shell @kind logic */
import type { ErrorInfo } from 'react';
import { getAppLog } from '../log/get-app-log';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const firstFrame = (info: ErrorInfo): string => info.componentStack?.trim().split('\n')[0]?.trim() ?? '';

const reportRenderError = (scope: string, error: unknown, info: ErrorInfo): void => {
  const where = firstFrame(info);
  getAppLog().error(`${scope} hit an error: ${messageOf(error)}${where ? ` (${where})` : ''}`);
};

export { reportRenderError };
