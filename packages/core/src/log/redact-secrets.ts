/* @layer core @kind logic */
import { REDACTION_RULES } from './redact-secrets.constants';

const redactSecrets = (line: string): string =>
  REDACTION_RULES.reduce((text, [pattern, into]) => text.replace(pattern, into), line);

export { redactSecrets };
