/* @layer electron-main @kind types */
interface Downloaded {
  file: string;
  bytes: number;
  sha256: string;
  dispose: () => Promise<void>;
}

interface DownloadOptions {
  signal: AbortSignal;
  onProgress: (done: number) => void;
  fetch?: typeof fetch;
}

export type { Downloaded, DownloadOptions };
