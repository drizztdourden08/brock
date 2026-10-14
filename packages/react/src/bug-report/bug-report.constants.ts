/* @layer renderer-shell @kind constants */
const GITHUB_ORIGIN = 'https://github.com';
const ISSUE_URL_LIMIT = 7500;
const TRUNCATED_MARK = '... (truncated)';
const DIAGNOSTICS_SUMMARY = 'Diagnostics';
const CODE_FENCE = '```';
const BUG_REPORT_LOG_TAIL = 200;
const SEND_LABEL = 'Send report';
const GITHUB_LABEL = 'Open GitHub issue';
const CLIPBOARD_LABEL = 'Copy report';
const DEFAULT_ATTACHMENT_LIMITS = { maxFiles: 5, maxBytes: 10 * 1024 * 1024 } as const;

export {
  BUG_REPORT_LOG_TAIL, CLIPBOARD_LABEL, DEFAULT_ATTACHMENT_LIMITS, CODE_FENCE, DIAGNOSTICS_SUMMARY, GITHUB_LABEL, GITHUB_ORIGIN, ISSUE_URL_LIMIT, SEND_LABEL, TRUNCATED_MARK,
};
