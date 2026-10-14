/* @layer electron-main @kind types */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { StartJob } from '@drizztdourden08/brock-electron/main';
import type { ToolDef, ToolDownload, ToolLocation, ToolPlatform, ToolState } from '../tools.type';

type ToolStream = 'stdout' | 'stderr';

interface ToolRunOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  onLine?: (line: string, stream: ToolStream) => void;
}

interface ToolRunResult {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
}

type FetchFn = (url: string, init?: { signal?: AbortSignal }) => Promise<Response>;

type DownloadProgress = (received: number, total: number | null) => void;

interface DownloadOptions {
  fetch: FetchFn;
  signal?: AbortSignal;
  onProgress?: DownloadProgress;
}

interface ToolProbeResult {
  ok: boolean;
  version?: string | null;
  error?: string | null;
}

interface ToolProbe {
  binary?: string;
  args?: readonly string[];
  timeoutMs?: number;
  read?: (output: ToolRunResult) => ToolProbeResult;
}

type ToolCheck = (paths: Record<string, string>) => Promise<ToolProbeResult>;

interface ToolRunCall {
  binary: string;
  file: string;
  args: readonly string[];
  options: ToolRunOptions;
}

type ToolRunNext = (call: ToolRunCall) => Promise<ToolRunResult>;

type ToolRunHook = (call: ToolRunCall, next: ToolRunNext) => Promise<ToolRunResult>;

interface ToolHooks {
  probe?: ToolProbe | ToolCheck;
  aroundRun?: ToolRunHook;
}

type ToolSpec = ToolDef & ToolHooks;

type PathSource = string | (() => string | Promise<string>);

interface ToolsEnv {
  cacheRoot: string;
  tempDir: string;
  platform: ToolPlatform | null;
  os: NodeJS.Platform;
  pathEnv: PathSource;
  fetch: FetchFn;
  job: StartJob;
  onChanged?: (id: string) => void;
}

interface LocateInput {
  cacheDir: string;
  platform: NodeJS.Platform;
  pathEnv: string;
  check?: ToolCheck;
}

interface InstallPlan {
  def: ToolDef;
  download: ToolDownload;
  cacheDir: string;
  platform: NodeJS.Platform;
}

interface ToolsMain {
  register: (def: ToolSpec) => () => void;
  list: () => Promise<ToolState[]>;
  state: (id: string) => Promise<ToolState | null>;
  locate: (id: string) => Promise<ToolLocation | null>;
  install: (id: string) => Promise<Result<ToolState>>;
  run: (id: string, binary: string, args: readonly string[], options?: ToolRunOptions) => Promise<ToolRunResult>;
}

export type {
  DownloadOptions, DownloadProgress, FetchFn, InstallPlan, LocateInput, ToolRunOptions, ToolRunResult, ToolStream, ToolsEnv, ToolsMain,
  ToolProbeResult, ToolProbe, ToolCheck, ToolRunCall, ToolRunNext, ToolRunHook, ToolHooks, ToolSpec, PathSource,
};
