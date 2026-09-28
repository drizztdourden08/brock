/* @layer tooling-scripts @kind barrel */
import { definePlugin } from '@drizztdourden08/brock-thread';
import { snes } from './snes-verb.mjs';

const plugin = definePlugin({ name: 'snes', verbs: { snes }, steps: { provision: [], build: [] } });

export { plugin, snes };
