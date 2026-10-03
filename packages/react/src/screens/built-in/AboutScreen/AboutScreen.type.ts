/* @layer renderer-shell @kind types */
interface AboutScreenOptions {
  legalText?: string;
}

interface AboutScreenBodyProps extends AboutScreenOptions {
  onClose: () => void;
}

export type { AboutScreenBodyProps, AboutScreenOptions };
