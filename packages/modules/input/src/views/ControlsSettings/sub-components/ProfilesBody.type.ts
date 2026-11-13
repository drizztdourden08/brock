/* @layer renderer-components @kind types */
import type { InputProfile } from '../../../bindings';
import type { ControlsLabels } from '../ControlsSettings.type';

interface ProfilesBodyProps {
  profiles: readonly InputProfile[];
  activeId: string | null;
  newlyCreatedId: string | null;
  labels: ControlsLabels;
  onSelect: (profile: InputProfile) => void;
  onDelete: (profile: InputProfile) => void;
  onRename: (profile: InputProfile, newName: string) => void;
}

export type { ProfilesBodyProps };
