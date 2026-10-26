/* @layer electron-main @kind types */
import type { ChildProcess } from 'child_process';
import type { JobRegistry, StartJob } from '@drizztdourden08/brock-core/jobs';
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import type { MainContext } from '../../types/main-context.type';

type ProcessStream = 'stdout' | 'stderr';

interface ProcessSpec {
  command: string;
  args: readonly string[];
  cwd?: string;
  env?: Readonly<Record<string, string>>;
}

interface ProcessProgressHint {
  fraction?: number;
  label?: string;
}

type ProcessProgressParser = (line: string, stream: ProcessStream) => number | ProcessProgressHint | null | undefined;

interface ProcessAllow {
  otherWindows?: boolean;
  network?: boolean;
  interpreters?: boolean;
  env?: readonly string[];
}

interface ProcessRunOptions {
  label: string;
  progress?: ProcessProgressParser;
  successCodes?: readonly number[];
  elevate?: 'installer';
  cancel?: { graceMs?: number };
  cancellable?: boolean;
  timeoutMs?: number;
  redact?: (line: string) => string;
  log?: boolean;
  allow?: ProcessAllow;
}

interface ProcessJobDef<A> extends ProcessRunOptions {
  parse: (raw: unknown) => A;
  resolve: (args: A, ctx: MainContext) => ProcessSpec | Promise<ProcessSpec>;
}

type ProcessAuthorize = (open: { anyWindow: boolean }) => boolean;

interface ProcessJobs {
  define: <A>(id: string, def: ProcessJobDef<A>) => void;
  start: (id: string, raw?: unknown, authorize?: ProcessAuthorize) => Promise<ProcessJobOutcome>;
  run: (id: string, spec: ProcessSpec, options: ProcessRunOptions) => Promise<ProcessJobOutcome>;
  cancelAll: () => void;
}

interface ProcessTrack {
  track?: (forceKill: () => void) => () => void;
}

type ProcessRunInput = ProcessRunOptions & ProcessTrack;

interface ExitFacts {
  code: number | null;
  signal: NodeJS.Signals | null;
  killed: boolean;
  timedOut: boolean;
  tail: string[];
}

interface ProcessJobsDeps {
  job: StartJob;
  jobs: JobRegistry;
  context: () => MainContext;
}

interface PreparedProcessJob {
  options: ProcessRunOptions;
  prepare: (raw: unknown) => Promise<ProcessSpec>;
}

interface ProcessStartInput {
  id: string;
  spec: ProcessSpec;
  options: ProcessRunOptions;
  track: (kill: () => void) => () => void;
}

interface EnvScan {
  allowed: string[];
  seen: Set<string>;
  fold: (key: string) => string;
}

type KillResult = 'sent' | 'refused' | 'gone';

type Killable = Pick<ChildProcess, 'pid' | 'exitCode' | 'signalCode'>;

interface StopperInput {
  child: Killable;
  signal: AbortSignal;
  graceMs: number;
  timeoutMs: number | undefined;
  giveUp: () => void;
}

interface Stopper {
  killed: () => boolean;
  timedOut: () => boolean;
  dispose: () => void;
}

export type {
  EnvScan, ExitFacts, Killable, KillResult, PreparedProcessJob, ProcessAllow, ProcessAuthorize, ProcessJobDef, ProcessJobs, ProcessJobsDeps,
  ProcessProgressHint, ProcessProgressParser, ProcessRunInput, ProcessRunOptions, ProcessSpec, ProcessStartInput, ProcessStream, Stopper, StopperInput,
};
