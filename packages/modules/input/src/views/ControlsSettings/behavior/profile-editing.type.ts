/* @layer renderer-components @kind types */
import type { InputProfile } from '../../../bindings';

interface UseProfileEditingArgs {
  profiles: readonly InputProfile[];
  initialEditId?: string | null;
  onRename: (profile: InputProfile, newName: string) => void;
}

export type { UseProfileEditingArgs };
