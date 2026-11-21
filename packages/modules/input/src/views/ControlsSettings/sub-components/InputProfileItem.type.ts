/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { ProfileItemHandlerArgs } from '../behavior/profile-item-handlers.type';
import type { ResolvedControlsLabels } from '../ControlsSettings.type';

interface InputProfileItemProps extends ProfileItemHandlerArgs {
  active: boolean;
  editing: boolean;
  editValue: string;
  inputRef: RefObject<HTMLInputElement | null>;
  labels: ResolvedControlsLabels;
}

export type { InputProfileItemProps };
