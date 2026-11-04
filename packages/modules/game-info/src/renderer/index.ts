/* @layer renderer-shell @kind barrel */
import type { RendererModule } from '@drizztdourden08/brock-react';
import { startGameInfoRuntime } from '../runtime/start-poller';
import { gameInfoWidget } from './game-info.widget';

startGameInfoRuntime();

const gameInfoRenderer: RendererModule = {
  id: 'game-info',
  widgets: [gameInfoWidget],
};

export default gameInfoRenderer;
export { gameInfoRenderer };
