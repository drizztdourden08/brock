/* @layer electron-main @kind logic */
import { app } from 'electron';
import { backgroundMode } from '../background/background-mode';
import { restartArgs } from './restart-args';
import { restartHandoffFile } from './restart-handoff-file';
import type { RestartOptions } from './restart.type';
import { writeHandoff } from './write-handoff';

const restartApp = ({ handoff, window = 'same' }: RestartOptions = {}): void => {
  if (handoff !== undefined) writeHandoff(restartHandoffFile(), handoff);
  app.relaunch({ args: restartArgs(process.argv.slice(1), window, backgroundMode.active) });
  app.exit(0);
};

export { restartApp };
