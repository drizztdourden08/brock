/* @layer electron-main @kind types */
interface MadeFolders {
  make: (prefix?: string) => string;
  holds: (real: string) => boolean;
  clear: () => void;
}

export type { MadeFolders };
