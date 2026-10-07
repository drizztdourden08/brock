/* @layer core @kind types */
import type { Result } from '../../result/result.type';

interface PickedFile {
  name: string;
  bytes: Uint8Array;
}

interface SaveFileRequest {
  name: string;
  bytes: Uint8Array;
  extensions?: string[];
}

interface SaveFileResult {
  saved: boolean;
  name?: string;
  error?: string;
}

interface PickPathOptions {
  folder?: boolean;
  extensions?: string[];
}

interface FilePickerPort {
  pickFile: (opts?: { extensions?: string[] }) => Promise<PickedFile | null>;
  saveFile: (request: SaveFileRequest) => Promise<SaveFileResult>;
  pickPath?: (opts?: PickPathOptions) => Promise<string | null>;
  pathOf?: (file: File) => string | null;
  openFolder?: (path: string) => Promise<Result>;
  revealPath?: (path: string) => Promise<Result>;
}

export type { PickedFile, PickPathOptions, SaveFileRequest, SaveFileResult, FilePickerPort };
