/* @layer renderer-shell @kind types */
interface ArchipelagoPlayerFile {
  slotName: string;
  yaml: string;
  notice?: string;
}

interface ArchipelagoFilesSource {
  apVersion: string;
  supportedVersions: readonly string[];
  moduleName: string;
  fileOf(): ArchipelagoPlayerFile;
}

type ArchipelagoFilesProps = ArchipelagoFilesSource;

export type { ArchipelagoFilesProps, ArchipelagoFilesSource, ArchipelagoPlayerFile };
