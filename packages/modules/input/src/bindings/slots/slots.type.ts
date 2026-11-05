/* @layer core @kind types */
import type { ResolvedControl } from '../../family/family.type';
import type { SdlButtonName } from '../../pad/sdl-button-name.type';
import type { SdlAxisName } from '../../sdl/sdl-buttons.type';
import type { BindingSlot, ButtonIcon, InputBinding } from '../bindings.type';

type SlotPosition = SdlButtonName | SdlAxisName;

interface SlotListEdit {
  slots: BindingSlot[];
  renumber: ReadonlyMap<number, number>;
}

interface SlotDisplay {
  position?: SlotPosition;
  icon?: ButtonIcon | null;
  label?: string;
}

interface SlotSeed extends SlotDisplay {
  binding?: InputBinding;
}

interface SlotSource {
  claimed: ReadonlySet<string>;
  controls?: readonly ResolvedControl[];
  keyboard?: boolean;
  stored?: readonly BindingSlot[];
  keyboardSlots?: () => BindingSlot[];
}

interface Positioned {
  position?: string;
}

export type { Positioned, SlotDisplay, SlotListEdit, SlotPosition, SlotSeed, SlotSource };
