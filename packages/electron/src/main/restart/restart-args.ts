/* @layer electron-main @kind logic */
import { BACKGROUND_FLAG } from '@drizztdourden08/brock-core/automation';
import type { RestartWindow } from './restart.type';

const restartArgs = (argv: readonly string[], window: RestartWindow, wasBackground: boolean): string[] => {
  const kept = argv.filter((arg) => arg !== BACKGROUND_FLAG);
  const background = window === 'same' ? wasBackground : window === 'background';
  return background ? [...kept, BACKGROUND_FLAG] : kept;
};

export { restartArgs };
