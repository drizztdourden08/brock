/* @layer electron-main @kind logic */
import type { StopServerInput } from './stop-server.type';

const createStopServer = ({ running, heartbeat, log, setExitCode }: StopServerInput): (() => Promise<void>) => {
  let stopping: Promise<void> | null = null;
  const run = async (): Promise<void> => {
    log('stopping');
    try {
      heartbeat.stop();
      await running.stop();
      log('stopped');
    } catch (error) {
      log(`stop failed: ${String(error)}`, 'error');
      setExitCode(1);
    }
  };
  return () => {
    stopping ??= run();
    return stopping;
  };
};

export { createStopServer };
