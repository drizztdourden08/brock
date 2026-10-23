/* @layer electron-main @kind logic */
import type { AskOutcome } from '@drizztdourden08/brock-core/ipc';
import { pendingAsks } from './ask-pending';

const settleAsk = (id: number, outcome: AskOutcome): void => {
  const entry = pendingAsks.get(id);
  if (!entry) return;
  entry.release();
  if (outcome.ok) entry.resolve(outcome.value);
  else entry.reject(new Error(outcome.message));
};

export { settleAsk };
