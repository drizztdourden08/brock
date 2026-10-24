/* @layer electron-main @kind types */
import type { DomainsFactory } from './server-host.type';
import type { LogSink } from './stdout-log.type';

type StopSignal = 'SIGTERM' | 'SIGINT';

interface SignalSource {
  once: (signal: StopSignal, listener: () => void) => unknown;
}

interface RunServerOptions<TDomains = undefined> {
  domains?: DomainsFactory<TDomains>;
  argv?: readonly string[];
  env?: Readonly<Record<string, string | undefined>>;
  cwd?: string;
  stdout?: LogSink;
  stderr?: LogSink;
  signals?: SignalSource;
  now?: () => number;
  heartbeatMs?: number;
  setExitCode?: (code: number) => void;
}

interface ServerRunHandle {
  dataDir: string;
  stop: () => Promise<void>;
}

interface ServerRuntime {
  argv: readonly string[];
  dataDir: string;
  stdout: LogSink;
  stderr: LogSink;
  signals: SignalSource;
  now: () => number;
  setExitCode: (code: number) => void;
}

export type { StopSignal, SignalSource, RunServerOptions, ServerRunHandle, ServerRuntime };
