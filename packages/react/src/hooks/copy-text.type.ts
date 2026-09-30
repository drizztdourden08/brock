/* @layer renderer-shell @kind types */
interface CopyText {
  copied: boolean;
  error: string | null;
  copy: (text: string) => Promise<boolean>;
}

export type { CopyText };
