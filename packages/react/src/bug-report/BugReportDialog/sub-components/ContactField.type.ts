/* @layer renderer-shell @kind types */
interface ContactFieldProps {
  shown: boolean;
  identity: string | null | undefined;
  value: string;
  onChange: (value: string) => void;
}

export type { ContactFieldProps };
