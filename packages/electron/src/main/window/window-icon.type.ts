/* @layer electron-main @kind types */
interface WindowIconQuery {
  dirs: readonly string[];
  platform: NodeJS.Platform;
  instanceName: string | null;
  exists: (path: string) => boolean;
}

interface WindowIconResult {
  path: string | undefined;
  warnings: string[];
}

export type { WindowIconQuery, WindowIconResult };
