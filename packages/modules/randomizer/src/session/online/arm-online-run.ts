/* @layer core @kind logic */
import { adoptArmedSeed } from './adopt-armed-seed';
import { applyOnlinePlacement } from './apply-online-placement';
import { ONLINE_TAG } from './online-session.constants';
import type { OnlineParts } from './online-parts.type';
import { revertOnline } from './revert-online';

const armOnlineRun = async <P, A>(parts: OnlineParts<P, A>): Promise<void> => {
  const { run, log, late } = parts;
  const generation = run.generation;
  run.applying = true;
  const result = await applyOnlinePlacement(parts);
  run.applying = false;
  if (generation !== run.generation) {
    if (result.ok) result.armed.stop?.();
    await revertOnline(parts);
    return;
  }
  if (result.ok) {
    adoptArmedSeed(parts, result.armed);
    return;
  }
  log(`${ONLINE_TAG} Session refused: ${result.refusal}`, 'error');
  await revertOnline(parts);
  late.refuse(result.refusal);
};

export { armOnlineRun };
