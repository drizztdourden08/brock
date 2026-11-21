/* @layer renderer-components @kind types */
import type { InputProfile } from '../../../bindings';
import type { ResolvedControlsLabels } from '../ControlsSettings.type';

interface ProfilesBodyProps {
  profiles: readonly InputProfile[];
  activeId: string | null;
  newlyCreatedId: string | null;
  labels: ResolvedControlsLabels;
  onSelect: (profile: InputProfile) => void;
  onDelete: (profile: InputProfile) => void;
  onRename: (profile: InputProfile, newName: string) => void;
}

export type { ProfilesBodyProps };
