/* @layer renderer-shell @kind logic */
import { getAppLog } from '@drizztdourden08/brock-react';
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import { RANDOMIZER_CHANNEL } from './log.constants';

const appRandomizerLog: RandomizerLog = (msg, level = 'info') => {
  getAppLog().log(RANDOMIZER_CHANNEL, msg, level);
};

export { appRandomizerLog };
