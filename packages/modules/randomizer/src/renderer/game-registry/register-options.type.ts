/* @layer renderer-shell @kind types */
import type { RandomizerLog } from '../../contract/randomizer-log.type';

interface RegisterOptions {
  runtime?: boolean;
  log?: RandomizerLog;
}

export type { RegisterOptions };
