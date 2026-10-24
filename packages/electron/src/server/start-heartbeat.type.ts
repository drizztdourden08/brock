/* @layer electron-main @kind types */
import type { ServerLog } from './server-host.type';

interface HeartbeatInput {
  dataDir: string;
  health?: () => boolean | Promise<boolean>;
  log: ServerLog;
  now?: () => number;
  intervalMs?: number;
}

interface Heartbeat {
  stop: () => void;
}

export type { HeartbeatInput, Heartbeat };
