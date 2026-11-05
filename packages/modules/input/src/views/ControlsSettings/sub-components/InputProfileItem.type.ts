/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { ProfileItemHandlerArgs } from '../behavior/profile-item-handlers.type';
import type { ControlsLabels } from '../ControlsSettings.type';

interface InputProfileItemProps extends ProfileItemHandlerArgs {
  active: boolean;
  editing: boolean;
  editValue: string;
  inputRef: RefObject<HTMLInputElement | null>;
  labels: ControlsLabels;
}

export type { InputProfileItemProps };
