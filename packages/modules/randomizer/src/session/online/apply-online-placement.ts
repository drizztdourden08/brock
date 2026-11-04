/* @layer core @kind logic */
import type { ApplyResult } from '../applier/apply-result.type';
import { foreignOf } from './foreign-of';
import { ONLINE_TAG } from './online-session.constants';
import type { OnlineParts } from './online-parts.type';

const applyOnlinePlacement = async <P, A>(parts: OnlineParts<P, A>): Promise<ApplyResult<A>> => {
  const { game, run, poller, log, report } = parts;
  try {
    return await game.applier.apply(run.placement as P, {
      tag: ONLINE_TAG,
      reportCheck: report,
      suppress: poller.suppress,
      log,
      foreign: (key) => foreignOf(parts, key),
    });
  } catch (error) {
    return { ok: false, refusal: error instanceof Error ? error.message : String(error) };
  }
};

export { applyOnlinePlacement };
