/* @layer core @kind logic */
import type { OnlineParts } from './online-parts.type';
import { revertOnline } from './revert-online';

const disarmOnlineRun = <P, A>(parts: OnlineParts<P, A>): void => {
  const { run, poller, ap, late } = parts;
  if (!run.live) return;
  run.live = false;
  run.generation += 1;
  run.stopCore?.();
  run.stopCore = null;
  poller.stop();
  run.queue?.stop();
  run.queue?.clear();
  run.armed?.stop?.();
  run.armed = null;
  run.queue = null;
  run.placement = null;
  run.scouted = null;
  run.keysById.clear();
  run.entriesByKey.clear();
  run.grants.clear();
  run.collected.clear();
  run.reportedAll.clear();
  run.pollWanted = false;
  run.goalDone = false;
  run.applying = false;
  late.publishPlacement(null);
  ap.disarm?.();
  void revertOnline(parts);
};

export { disarmOnlineRun };
