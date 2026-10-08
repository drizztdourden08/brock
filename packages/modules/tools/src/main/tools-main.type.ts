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

interface ToolsEnv {
  cacheRoot: string;
  tempDir: string;
  platform: ToolPlatform | null;
  os: NodeJS.Platform;
  pathEnv: string;
  fetch: FetchFn;
  job: StartJob;
}

interface LocateInput {
  cacheDir: string;
  platform: NodeJS.Platform;
  pathEnv: string;
}

interface InstallPlan {
  def: ToolDef;
  download: ToolDownload;
  cacheDir: string;
  platform: NodeJS.Platform;
}

interface ToolsMain {
  register: (def: ToolDef) => () => void;
  list: () => Promise<ToolState[]>;
  state: (id: string) => Promise<ToolState | null>;
  locate: (id: string) => Promise<ToolLocation | null>;
  install: (id: string) => Promise<Result<ToolState>>;
  run: (id: string, binary: string, args: readonly string[], options?: ToolRunOptions) => Promise<ToolRunResult>;
}

export type {
  DownloadOptions, DownloadProgress, FetchFn, InstallPlan, LocateInput, ToolRunOptions, ToolRunResult, ToolStream, ToolsEnv, ToolsMain,
};
