/* @layer core @kind types */
interface InstallProgress {
  phase: 'unpack';
  done: number;
  total: number;
}

interface InstalledPack {
  installedName: string;
  ownName: string;
}

export type { InstalledPack, InstallProgress };
