/* @layer electron-main @kind logic */
import { noteSync } from './note-sync';
import { stackOf } from './stack-of';

const installProcessHooks = (): void => {
  process.on('uncaughtExceptionMonitor', (error, origin) => {
    noteSync('error', `${origin} ${stackOf(error)}`);
  });
  process.on('exit', (code) => {
    noteSync('info', `process exit code=${code}`);
  });
};

export { installProcessHooks };
