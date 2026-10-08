/* @layer renderer-shell @kind logic */
import type { BugReportTarget } from './bug-report.type';
import type { TargetSources } from './bug-report-payload.type';
import { CLIPBOARD_LABEL, GITHUB_LABEL, SEND_LABEL } from './bug-report.constants';

const resolveBugReportTarget = ({ app, main, sendToMain, repo }: TargetSources): BugReportTarget => {
  if (app) return { kind: 'transport', label: app.label ?? SEND_LABEL, send: app.transport };
  if (main && sendToMain) return { kind: 'transport', label: main.label, send: sendToMain };
  if (repo) return { kind: 'github', label: GITHUB_LABEL, repo };
  return { kind: 'clipboard', label: CLIPBOARD_LABEL };
};

export { resolveBugReportTarget };
