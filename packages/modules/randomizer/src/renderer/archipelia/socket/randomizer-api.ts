/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { RandomizerHostApi } from '../../../ipc/randomizer-host-api.type';

const randomizerApi = (): RandomizerHostApi | null => hostApi()?.randomizer ?? null;

export { randomizerApi };
