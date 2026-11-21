/* @layer renderer-shell @kind logic */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';
import { msuLayer } from './msu-layer';

const msuRenderer: RendererModule = {
  id: 'msu',
  logChannels: ['msu'],
  messages: [msuLayer],
};

export { msuRenderer };
