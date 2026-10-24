/* @layer core @kind types */
interface ImportProgress {
  kind: string;
  id: string;
  phase: 'download' | 'extract' | 'copy' | 'decode' | 'done' | 'error';
  loaded?: number;
  total?: number;
  message?: string;
}

interface LogEntryWire {
  channel: string;
  level: string;
  message: string;
}

interface PickedFileWire {
  name: string;
  data: ArrayBuffer;
}

interface SaveFileResultWire {
  saved: boolean;
  name?: string;
  error?: string;
}

type QuitDecision = 'quit' | 'stay';

type EditRole = 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll';

type AskOutcome = { ok: true; value: unknown } | { ok: false; message: string };

export type { AskOutcome, EditRole, ImportProgress, LogEntryWire, PickedFileWire, QuitDecision, SaveFileResultWire };
