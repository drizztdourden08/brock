/* @layer renderer-shell @kind types */
interface VersionTagModel {
  label: string;
  hasUpdate: boolean;
  title: string;
  onOpen: () => void;
}

export type { VersionTagModel };
