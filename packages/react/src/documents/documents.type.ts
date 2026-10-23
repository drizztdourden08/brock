/* @layer renderer-shell @kind types */
import type { RecentDocument, RecoverableSnapshot } from '@drizztdourden08/brock-core';

interface RecentDocumentsState {
  recent: RecentDocument[];
  refresh: () => Promise<void>;
  clear: () => Promise<void>;
  open: (path: string) => Promise<string | null>;
}

type UseRecentDocuments = RecentDocumentsState;

interface UseRecentMenuOptions {
  onOpen: (path: string) => void;
  label?: string;
}

interface RecoveredSnapshot {
  snapshot: RecoverableSnapshot;
  bytes: Uint8Array;
}

interface RecoverableState {
  snapshots: RecoverableSnapshot[];
  refresh: () => Promise<void>;
  restore: (key: string) => Promise<RecoveredSnapshot | null>;
  discard: (key: string) => Promise<void>;
}

type UseRecoverable = RecoverableState;

interface RecoveryPromptProps {
  onRestore: (recovered: RecoveredSnapshot) => void | Promise<void>;
}

export type {
  RecentDocumentsState, RecoverableState, RecoveredSnapshot, RecoveryPromptProps, UseRecentDocuments, UseRecentMenuOptions, UseRecoverable,
};
