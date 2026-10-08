/* @layer core @kind types */
import type { Result } from '@drizztdourden08/brock-core/result';

type ToolPlatform = `${'win32' | 'darwin' | 'linux'}-${'x64' | 'arm64'}`;

type ToolArchive = 'zip' | 'tar' | 'none';

interface ToolDownload {
  url: string;
  sha256: string;
  size?: number;
  archive?: ToolArchive;
}

interface ToolDef {
  id: string;
  label: string;
  binaries: string[];
  version?: string;
  downloads?: Partial<Record<ToolPlatform, ToolDownload>>;
  resolveDownload?: (platform: ToolPlatform) => Promise<ToolDownload | null>;
  usePath?: boolean;
  installHint?: string;
}

type ToolStatus = 'ready' | 'missing' | 'unavailable';

type ToolSource = 'cache' | 'path';

interface ToolLocation {
  source: ToolSource;
  paths: Record<string, string>;
}

interface ToolState {
  id: string;
  label: string;
  status: ToolStatus;
  source: ToolSource | null;
  paths: Record<string, string> | null;
  canInstall: boolean;
  hint: string | null;
}

interface ToolsApi {
  list: () => Promise<ToolState[]>;
  state: (id: string) => Promise<ToolState | null>;
  install: (id: string) => Promise<Result<ToolState>>;
}

export type {
  ToolArchive, ToolDef, ToolDownload, ToolLocation, ToolPlatform, ToolSource, ToolState, ToolStatus, ToolsApi,
};
