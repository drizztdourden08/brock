/* @layer electron-main @kind types */
interface MarkDeps {
  platform?: NodeJS.Platform;
  writeFile?: (path: string, data: string) => Promise<void>;
}

export type { MarkDeps };
