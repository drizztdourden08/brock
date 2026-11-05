/* @layer core @kind constants */
import type { RandomizerLogText } from '../../contract/randomizer-log-text.type';
import { LOCAL_TAG } from '../local/local-session.constants';

const DEFAULT_LOG_TEXT: RandomizerLogText = {
  autoStart: (mode, seed) => `[Boot] Auto-starting ${mode} session for this profile (seed ${seed})`,
  armed: (summary) => `${LOCAL_TAG} Session armed: ${summary}`,
  rerollFailed: (message) => `[Boot] Randomizer generation failed: ${message}`,
};

export { DEFAULT_LOG_TEXT };
