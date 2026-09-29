/* @layer renderer-shell @kind types */
interface AboutRow {
  label: string;
  value: string;
}

interface AboutProps {
  productName: string;
  logoSrc?: string;
  rows: readonly AboutRow[];
  legalText?: string;
  copyText?: string | null;
}

interface AboutInfo {
  version: string;
  rows: AboutRow[];
  copyText: string | null;
}

export type { AboutInfo, AboutProps, AboutRow };
