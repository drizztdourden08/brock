/* @layer renderer-shell @kind types */
interface ContactFieldProps {
  shown: boolean;
  value: string;
  onChange: (value: string) => void;
}

export type { ContactFieldProps };
