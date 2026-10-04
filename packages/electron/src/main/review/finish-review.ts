/* @layer electron-main @kind logic */
import { app } from 'electron';
import { buildReviewReport } from '@drizztdourden08/brock-core/review';
import { readMainLogIssues } from '../logs/read-main-log-issues';
import { REVIEW_QUIT_GRACE_MS } from './review.constants';
import type { ReviewSession } from './review-session.type';
import { writeReviewReport } from './write-review-report';

const quitWith = (code: number): void => {
  app.once('quit', () => app.exit(code));
  setTimeout(() => app.exit(code), REVIEW_QUIT_GRACE_MS);
  app.quit();
};

const finishReview = async (session: ReviewSession, finished: boolean): Promise<void> => {
  let code = 1;
  try {
    for (const line of await readMainLogIssues()) session.addMainLine(line);
    const report = buildReviewReport(session.run(), { finished, finishedAt: Date.now() });
    process.stdout.write(`${await writeReviewReport(session.dir, report)}\n`);
    code = report.passed ? 0 : 1;
  } catch (err) {
    process.stderr.write(`review report failed: ${err instanceof Error ? err.message : String(err)}\n`);
  }
  quitWith(code);
};

export { finishReview };
