/* @layer core @kind test */
import type { MsuGameConfig } from '../src/config/msu-game-config.type';

const demoConfig = (soundChannels: MsuGameConfig['soundChannels']): MsuGameConfig => ({
  id: 'demo',
  packRoot: 'msu',
  soundChannels,
  soundIdCount: 32,
  trackLoops: () => true,
  classifyMusic: () => ({ kind: 'ignore' }),
  resumePath: (profile, kind, id) => `${profile}/${kind}/${id}.json`,
});

export { demoConfig };
