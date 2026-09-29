/* @layer electron-main @kind logic */
import { readFile } from 'fs/promises';
import type { ReviewLogLine } from '@drizztdourden08/brock-core/review';
import { ISSUE_LINE } from './main-log-issue.constants';
import { mainLogBuffer } from './main-log-buffer';
import { mainLogPath } from './main-log-path';

const issueOf = (line: string): ReviewLogLine | null => {
  const [, level, message = ''] = ISSUE_LINE.exec(line) ?? [];
  if (level === 'warn' || level === 'error') return { level, message };
  return null;
};

const readMainLogIssues = async (): Promise<ReviewLogLine[]> => {
  const written = await readFile(mainLogPath(), 'utf-8').catch(() => '');
  return [...written.split(/\r?\n/), ...mainLogBuffer.pending]
    .map(issueOf)
    .filter((issue): issue is ReviewLogLine => issue !== null);
};

export { readMainLogIssues };
