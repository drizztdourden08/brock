/* @layer renderer-components @kind types */
import type { InputProfile } from '../../../bindings';

interface ProfileItemHandlerArgs {
  profile: InputProfile;
  onSelect: (profile: InputProfile) => void;
  onDelete: (profile: InputProfile) => void;
  onStartEditing: (profile: InputProfile) => void;
  onCommitEdit: (profile: InputProfile) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
}

export type { ProfileItemHandlerArgs };
