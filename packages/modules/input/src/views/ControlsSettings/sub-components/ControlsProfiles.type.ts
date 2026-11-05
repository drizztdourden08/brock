/* @layer renderer-components @kind types */
import type { InputProfile } from '../../../bindings';
import type { ControlsLabels } from '../ControlsSettings.type';

interface ControlsProfilesProps {
  profiles: readonly InputProfile[];
  activeId: string | null;
  newlyCreatedId: string | null;
  labels: ControlsLabels;
  narrow: boolean;
  onSelect: (profile: InputProfile) => void;
  onDelete: (profile: InputProfile) => void;
  onRename: (profile: InputProfile, newName: string) => void;
  onCreate: () => void;
}

export type { ControlsProfilesProps };
