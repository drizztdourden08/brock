/* @layer renderer-shell @kind types */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';

interface DocumentFolderFieldProps {
  value: string | null;
  onChange: (path: string | null) => void;
  roots?: readonly string[];
  label: string;
  disabled?: boolean;
}

interface FolderFieldState {
  reason: string | null;
  browse: () => Promise<string | null>;
  rootOptions: readonly SelectOption[];
  rootValue: string | null;
}

interface FolderCheck {
  path: string | null;
  reason: string | null;
}

export type { DocumentFolderFieldProps, FolderCheck, FolderFieldState };
