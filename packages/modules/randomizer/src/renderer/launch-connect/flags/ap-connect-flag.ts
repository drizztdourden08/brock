/* @layer renderer-shell @kind logic */
import { parseApConnect } from '../../../archipelago/launch-flags';
import type { ApConnect } from '../../../archipelago/launch-flags';
import type { LaunchConnectHost, LaunchFlag } from '../launch-connect.type';
import { parsedFlag } from './parsed-flag';

const apConnectFlag = (log: LaunchConnectHost['log']): LaunchFlag<ApConnect> => parsedFlag('ap-connect', parseApConnect, log);

export { apConnectFlag };
