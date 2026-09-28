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

export type { ImportProgress, LogEntryWire, PickedFileWire, SaveFileResultWire };
