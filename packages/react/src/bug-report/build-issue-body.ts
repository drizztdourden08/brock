/* @layer renderer-shell @kind logic */
import { CODE_FENCE, DIAGNOSTICS_SUMMARY } from './bug-report.constants';

const buildIssueBody = (description: string, diagnostics: string | null): string => {
  const text = description.trim();
  if (!diagnostics) return text;
  return [
    text,
    `<details><summary>${DIAGNOSTICS_SUMMARY}</summary>`,
    `${CODE_FENCE}text\n${diagnostics}\n${CODE_FENCE}`,
    '</details>',
  ].join('\n\n');
};

export { buildIssueBody };
