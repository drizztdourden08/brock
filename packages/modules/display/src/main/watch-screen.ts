/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { MainContext } from '@drizztdourden08/brock-electron/main';

const watchScreen = (emit: MainContext['emit']): void => {
  const changed = (): void => { emit('display:changed'); };
  screen.on('display-added', changed);
  screen.on('display-removed', changed);
  screen.on('display-metrics-changed', changed);
};

export { watchScreen };
