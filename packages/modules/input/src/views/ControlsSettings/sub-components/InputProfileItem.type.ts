/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { InputProfile } from '../../../bindings';
import type { ControlsLabels } from '../ControlsSettings.type';

interface InputProfileItemProps {
  profile: InputProfile;
  active: boolean;
  editing: boolean;
  editValue: string;
  inputRef: RefObject<HTMLInputElement | null>;
  labels: ControlsLabels;
  onSelect: (profile: InputProfile) => void;
  onDelete: (profile: InputProfile) => void;
  onStartEditing: (profile: InputProfile) => void;
  onCommitEdit: (profile: InputProfile) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
}

export type { InputProfileItemProps };
