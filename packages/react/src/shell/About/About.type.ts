/* @layer renderer-shell @kind types */
interface AboutRow {
  label: string;
  value: string;
}

interface AboutProps {
  productName: string;
  version: string;
  logoSrc?: string;
  rows: readonly AboutRow[];
  legalText?: string;
  copyText?: string;
}

interface AboutInfo {
  version: string;
  rows: AboutRow[];
  copyText: string;
}

export type { AboutInfo, AboutProps, AboutRow };
