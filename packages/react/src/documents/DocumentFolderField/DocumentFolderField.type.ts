/* @layer renderer-shell @kind types */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';

interface DocumentFolderFieldProps {
  value: string | null;
  onChange: (path: string | null) => void;
  roots?: readonly string[];
  label: string;
  disabled?: boolean;
}

interface FolderDropState {
  reason: string | null;
  stamp: number;
  change: (path: string | null) => void;
}

interface FolderFieldState {
  reason: string | null;
  change: (path: string | null) => void;
  browse: () => Promise<string | null>;
  rootOptions: readonly SelectOption[];
  rootValue: string | undefined;
}

interface FolderCheck {
  path: string | null;
  reason: string | null;
}

export type { DocumentFolderFieldProps, FolderCheck, FolderDropState, FolderFieldState };
