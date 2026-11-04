/* @layer renderer-shell @kind types */
interface ServerSetupDraft {
  serverUrl: string;
  slotName: string;
  password: string;
}

interface ServerSetupForm {
  draft: ServerSetupDraft;
  set(field: keyof ServerSetupDraft, value: string): void;
  slotError: string | null;
  canApply: boolean;
  applyError: string | null;
  apply(): void;
}

export type { ServerSetupDraft, ServerSetupForm };
