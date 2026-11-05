/* @layer renderer-shell @kind logic */
import { MAX_CATCH_UP_STEPS, TIMER_PERIOD_MS } from './frame.constants';

const nextTimerDue = (due: number, now: number): number =>
  now - due > TIMER_PERIOD_MS * MAX_CATCH_UP_STEPS ? now + TIMER_PERIOD_MS : due + TIMER_PERIOD_MS;

export { nextTimerDue };
