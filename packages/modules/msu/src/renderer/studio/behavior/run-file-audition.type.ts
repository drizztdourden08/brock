/* @layer renderer-shell @kind types */
import type { Dispatch, SetStateAction } from 'react';
import type { Audition } from '../../audition';

interface FileAuditionSetters {
  setPlaying: Dispatch<SetStateAction<string | null>>;
  setAudition: Dispatch<SetStateAction<Audition | null>>;
  setLoading: Dispatch<SetStateAction<string | null>>;
  setLoops: Dispatch<SetStateAction<Map<string, number | null>>>;
}

interface FileAuditionRun {
  fileName: string;
  read: () => Promise<ArrayBuffer>;
  isCurrent: () => boolean;
  setters: FileAuditionSetters;
}

export type { FileAuditionRun, FileAuditionSetters };
