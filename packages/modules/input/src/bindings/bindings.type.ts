/* @layer core @kind types */
import type { SdlButtonName } from '../pad/sdl-button-name.type';
import type { SdlAxisName } from '../sdl/sdl-buttons.type';

interface NoneBinding {
  type: 'none';
}

interface KeyboardBinding {
  type: 'keyboard';
  code: string;
  label?: string;
  modifiers?: {
    shift?: boolean;
    ctrl?: boolean;
    alt?: boolean;
  };
}

interface GamepadButtonBinding {
  type: 'gamepad-button';
  index: number;
  label?: string;
}

interface GamepadAxisBinding {
  type: 'gamepad-axis';
  axisIndex: number;
  direction: '+' | '-';
  label?: string;
}

type InputBinding = NoneBinding | KeyboardBinding | GamepadButtonBinding | GamepadAxisBinding;

interface ButtonIcon {
  key: string;
  path: string | null;
  label: string;
}

interface ActionBinding {
  action: string;
  binding: InputBinding;
  icon: ButtonIcon | null;
  sourceVid?: string | null;
  sourcePid?: string | null;
}

interface BindingSlot {
  index: number;
  binding: InputBinding;
  position?: SdlButtonName | SdlAxisName;
  label: string;
  icon?: ButtonIcon | null;
}

type VerbBindings = Record<string, InputBinding>;

type VerbPosition = SdlButtonName | { axis: SdlAxisName; direction: '+' | '-' };

export type {
  ActionBinding, BindingSlot, ButtonIcon, GamepadAxisBinding, GamepadButtonBinding, InputBinding, KeyboardBinding,
  NoneBinding, VerbBindings, VerbPosition,
};
