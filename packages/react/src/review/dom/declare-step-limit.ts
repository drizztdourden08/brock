/* @layer renderer-shell @kind logic */
import { reviewAlive } from './review-alive';

const declareStepLimit = (timeoutMs: number | null): void => reviewAlive(true, timeoutMs);

export { declareStepLimit };
