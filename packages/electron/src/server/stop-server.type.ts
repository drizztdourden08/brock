/* @layer electron-main @kind types */
import type { Heartbeat } from './start-heartbeat.type';
import type { RunningServer, ServerLog } from './server-host.type';

interface StopServerInput {
  running: RunningServer;
  heartbeat: Heartbeat;
  log: ServerLog;
  setExitCode: (code: number) => void;
}

export type { StopServerInput };
