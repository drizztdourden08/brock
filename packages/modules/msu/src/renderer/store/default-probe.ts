/* @layer renderer-shell @kind logic */
import type { AudioProbe } from '../../audio-probe';
import { msuApi } from '../msu-api';

const defaultProbe: AudioProbe = async (dataPath) => (await msuApi()?.probeAudio(dataPath)) ?? null;

export { defaultProbe };
