/* @layer renderer-shell @kind types */
type FileRenameParams = {
  name: string;
  onRename: (from: string, to: string) => void;
};

export type { FileRenameParams };
