/* @layer renderer-shell @kind logic */
import { getAppLog } from '../log/get-app-log';
import type { MenuIssue } from './menu-config.type';

const reported = new Set<string>();

const reportMenuIssues = (issues: readonly MenuIssue[]): void => {
  if (!import.meta.env.DEV) return;
  for (const { message } of issues) {
    if (reported.has(message)) continue;
    reported.add(message);
    getAppLog().log('app', `Menu config: ${message}.`, 'warn');
  }
};

export { reportMenuIssues };
