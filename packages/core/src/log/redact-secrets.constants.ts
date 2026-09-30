/* @layer core @kind constants */
const REDACTED = '***';

const REDACTION_RULES: readonly (readonly [RegExp, string])[] = [
  [/\b([a-z][a-z0-9+.-]*:\/\/)[^\s/:@]+:[^\s/@]+@/gi, `$1${REDACTED}:${REDACTED}@`],
  [/\b(Bearer|Basic|Token)\s+[\w.~+/=-]{6,}/gi, `$1 ${REDACTED}`],
  [
    /\b([\w.-]*(?:token|secret|password|passwd|pwd|api[_-]?key|access[_-]?key|private[_-]?key|credential|session[_-]?id|cookie|authorization)[\w.-]*)(["']?\s*[:=]\s*["']?)(?!(?:Bearer|Basic|Token)\s)(?!\*{3})[^\s"'&,;]+/gi,
    `$1$2${REDACTED}`,
  ],
  [/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_\w{20,}|glpat-[\w-]{20,}|npm_[A-Za-z0-9]{30,}|xox[abprs]-[\w-]{10,}|sk-[\w-]{20,}|AIza[\w-]{30,}|AKIA[0-9A-Z]{16})\b/g, REDACTED],
  [/\beyJ[\w-]{8,}\.[\w-]{8,}\.[\w-]{8,}/g, REDACTED],
];

export { REDACTED, REDACTION_RULES };
