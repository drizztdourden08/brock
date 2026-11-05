/* @layer renderer-shell @kind logic */
import { appRandomizerLog } from '../../../session/log/app-randomizer-log';
import { SAMPLER_INTERVAL_MS } from './tracker-feed.constants';

const startSampler = (onTick: () => void): (() => void) => {
  const timer = setInterval(onTick, SAMPLER_INTERVAL_MS);
  appRandomizerLog(`[Tracker] Sampler started (every ${SAMPLER_INTERVAL_MS}ms)`);
  return () => {
    clearInterval(timer);
    appRandomizerLog('[Tracker] Sampler stopped');
  };
};

export { startSampler };
