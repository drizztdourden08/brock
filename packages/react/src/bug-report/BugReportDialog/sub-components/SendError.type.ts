/* @layer renderer-shell @kind types */
interface SendErrorProps {
  error: string | null;
  fallback: (() => void) | null;
}

export type { SendErrorProps };
