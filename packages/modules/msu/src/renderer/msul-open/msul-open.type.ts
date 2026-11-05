/* @layer renderer-shell @kind types */
interface MsulInstalled {
  pack: string;
  fileCount: number;
  trackCount: number;
}

interface MsulInstaller {
  installMsulFile: (bytes: Uint8Array, stem: string) => Promise<MsulInstalled>;
}

export type { MsulInstalled, MsulInstaller };
