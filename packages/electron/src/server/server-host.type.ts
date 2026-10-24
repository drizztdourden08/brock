/* @layer electron-main @kind types */
import type { MainLogLevel } from '../main/logs/main-log-file.type';

type ServerLog = (message: string, level?: MainLogLevel) => void;

interface ServerHost<TDomains = undefined> {
  dataDir: string;
  args: readonly string[];
  log: ServerLog;
  domains?: TDomains;
}

interface RunningServer {
  stop: () => void | Promise<void>;
  health?: () => boolean | Promise<boolean>;
}

type ServerStart<TDomains = undefined> = (host: ServerHost<TDomains>) => RunningServer | Promise<RunningServer>;

type DomainsFactory<TDomains> = (dataDir: string) => TDomains;

export type { ServerLog, ServerHost, RunningServer, ServerStart, DomainsFactory };
