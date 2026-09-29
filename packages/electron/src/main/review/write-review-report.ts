/* @layer electron-main @kind logic */
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import type { ReviewReport } from '@drizztdourden08/brock-core/review';
import { renderReviewMarkdown } from '@drizztdourden08/brock-core/review';
import { REPORT_JSON, REPORT_MARKDOWN } from './review.constants';

const writeReviewReport = async (dir: string, report: ReviewReport): Promise<string> => {
  await mkdir(dir, { recursive: true });
  const jsonPath = join(dir, REPORT_JSON);
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8');
  await writeFile(join(dir, REPORT_MARKDOWN), renderReviewMarkdown(report), 'utf-8');
  return jsonPath;
};

export { writeReviewReport };
