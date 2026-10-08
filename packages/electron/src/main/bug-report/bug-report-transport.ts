/* @layer electron-main @kind logic */
import type { BugReportOptions } from './bug-report.type';

const bugReportTransport: { current: BugReportOptions | null } = { current: null };

export { bugReportTransport };
