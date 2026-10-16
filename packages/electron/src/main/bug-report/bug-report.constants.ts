/* @layer electron-main @kind constants */
const DEFAULT_SEND_LABEL = 'Send report';
const DEBUG_FILE = /\.(?:log|txt|json)$/i;
const REPORT_ENTRY = 'report.json';
const LOGS_FOLDER = 'logs';
const ATTACHMENTS_FOLDER = 'attachments';
const NO_SERVICE = 'This app has no report service.';
const RETRY_GONE = 'This report can no longer be retried.';

export { DEFAULT_SEND_LABEL, DEBUG_FILE, REPORT_ENTRY, LOGS_FOLDER, ATTACHMENTS_FOLDER, NO_SERVICE, RETRY_GONE };
