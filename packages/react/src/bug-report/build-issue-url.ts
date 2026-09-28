/* @layer renderer-shell @kind logic */
import { GITHUB_ORIGIN, ISSUE_URL_LIMIT } from './bug-report.constants';
import type { IssueDraft } from './bug-report.type';
import { buildIssueBody } from './build-issue-body';
import { fitLength } from './fit-length';
import { truncateText } from './truncate-text';

const issueUrl = (draft: IssueDraft, description: string, diagnostics: string | null): string => {
  const { repo, title } = draft;
  const query = new URLSearchParams({ title: title.trim(), body: buildIssueBody(description, diagnostics) });
  return `${GITHUB_ORIGIN}/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}/issues/new?${query.toString()}`;
};

const buildIssueUrl = (draft: IssueDraft, limit = ISSUE_URL_LIMIT): string => {
  const { description, diagnostics } = draft;
  const full = issueUrl(draft, description, diagnostics);
  if (full.length <= limit) return full;

  if (diagnostics) {
    const withoutDiagnostics = issueUrl(draft, description, truncateText(diagnostics, 0));
    if (withoutDiagnostics.length <= limit) {
      const keep = fitLength(diagnostics.length, (n) => issueUrl(draft, description, truncateText(diagnostics, n)).length <= limit);
      return issueUrl(draft, description, truncateText(diagnostics, keep));
    }
  }

  const keep = fitLength(description.length, (n) => issueUrl(draft, truncateText(description, n), null).length <= limit);
  return issueUrl(draft, truncateText(description, keep), null);
};

export { buildIssueUrl };
