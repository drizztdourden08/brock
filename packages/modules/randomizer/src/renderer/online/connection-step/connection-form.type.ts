/* @layer renderer-shell @kind types */
interface ConnectionForm {
  host: string;
  port: string;
  slotName: string;
  password: string;
  deathLink: boolean;
}

export type { ConnectionForm };
