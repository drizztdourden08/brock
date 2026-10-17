/* @layer electron-main @kind logic */
import { captureHolds } from '../handlers/capture-holds';
import { REVIEW_HOLD_MS } from './review.constants';
import type { ReviewSession } from './review-session.type';

const awaitCaptureHolds = async (session: ReviewSession, step: string): Promise<void> => {
  if (await captureHolds.settledWithin(REVIEW_HOLD_MS)) return;
  const reason = `${captureHolds.count()} screenshot hold(s) still open after ${REVIEW_HOLD_MS / 1000} s; captured what there was`;
  session.addCheck({ id: 'capture-holds', step, pass: false, reason });
};

export { awaitCaptureHolds };
