/* @layer electron-main @kind types */
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

interface ProcessRunOptions {
  label: string;
  progress?: ProcessProgressParser;
  successCodes?: readonly number[];
  elevate?: 'installer';
  cancel?: { graceMs?: number };
}

interface ProcessJobDef<A> extends ProcessRunOptions {
  parse: (raw: unknown) => A;
  resolve: (args: A, ctx: MainContext) => ProcessSpec | Promise<ProcessSpec>;
}

interface ProcessJobs {
  define: <A>(id: string, def: ProcessJobDef<A>) => void;
  start: (id: string, raw?: unknown) => Promise<ProcessJobOutcome>;
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
  cancelled: boolean;
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

interface CancelWatch {
  pid: number | undefined;
  signal: AbortSignal;
  graceMs: number;
  giveUp: () => void;
}

export type {
  CancelWatch, ExitFacts, PreparedProcessJob, ProcessJobDef, ProcessJobs, ProcessJobsDeps, ProcessProgressHint, ProcessProgressParser, ProcessRunInput,
  ProcessRunOptions, ProcessSpec, ProcessStream,
};
