/* @layer renderer-shell @kind types */
interface AboutRow {
  label: string;
  value: string;
}

interface AboutInfo {
  version: string;
  rows: AboutRow[];
  copyText: string | null;
}

export type { AboutInfo, AboutRow };
