/* @layer electron-main @kind logic */
import { app } from 'electron';
import { buildReviewReport } from '@drizztdourden08/brock-core/review';
import type { ReviewEnding, ReviewRun } from '@drizztdourden08/brock-core/review';
import { readMainLogIssues } from '../logs/read-main-log-issues';
import { applyBaselines } from './baselines/apply-baselines';
import { REVIEW_QUIT_GRACE_MS } from './review.constants';
import type { ReviewSession } from './review-session.type';
import { writeReviewReport } from './write-review-report';

const quitWith = (code: number): void => {
  app.once('quit', () => app.exit(code));
  setTimeout(() => app.exit(code), REVIEW_QUIT_GRACE_MS);
  app.quit();
};

const failedChecksOf = (run: ReviewRun, ending: ReviewEnding): string[] =>
  buildReviewReport(run, ending).checks.filter((check) => !check.pass).map((check) => `${check.id} (${check.step})`);

const withBaselines = async (session: ReviewSession, ending: ReviewEnding): Promise<ReviewRun> => {
  const run = session.run();
  if (!session.baselines) return run;
  const baselines = await applyBaselines(session.baselines, {
    steps: run.steps,
    reviewDir: session.dir,
    finished: ending.finished,
    masksOf: session.masksOf,
    settled: session.settled,
    failedChecks: failedChecksOf(run, ending),
  });
  return { ...run, baselines };
};

const finishReview = async (session: ReviewSession, finished: boolean): Promise<void> => {
  let code = 1;
  try {
    for (const line of await readMainLogIssues()) session.addMainLine(line);
    const ending = { finished, finishedAt: Date.now() };
    const report = buildReviewReport(await withBaselines(session, ending), ending);
    process.stdout.write(`${await writeReviewReport(session.dir, report)}\n`);
    code = report.passed ? 0 : 1;
  } catch (err) {
    process.stderr.write(`review report failed: ${err instanceof Error ? err.message : String(err)}\n`);
  }
  quitWith(code);
};

export { finishReview };
