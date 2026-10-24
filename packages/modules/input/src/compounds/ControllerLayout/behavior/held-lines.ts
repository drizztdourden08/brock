/* @layer renderer-shell @kind logic */
import { ANALOG_IDS, CONTROLLER_SLOT_IDS, STICK_IDS } from '../ControllerLayout.constants';
import type { ControllerExtra, ControllerSlotId, ControllerSlots, ControllerStrings } from '../ControllerLayout.type';
import { amountOf } from './amount-of';
import { clampAxis } from './clamp-axis';
import { isActive } from './is-active';
import { percent } from './percent';
import { slotName } from './slot-name';
import { stickMoved } from './stick-moved';

const slotLine = (slots: ControllerSlots, id: ControllerSlotId, strings: ControllerStrings): string | null => {
  const state = slots[id];
  const name = slotName(slots, id, strings);
  if (STICK_IDS.has(id)) {
    if (!stickMoved(state)) return null;
    return strings.stickAt(name, clampAxis(state?.x).toFixed(2), clampAxis(state?.y).toFixed(2));
  }
  if (!isActive(state)) return null;
  return ANALOG_IDS.has(id) && state?.value !== undefined ? strings.amount(name, percent(amountOf(state))) : name;
};

const extraLine = (extra: ControllerExtra, strings: ControllerStrings): string | null => {
  if (!isActive(extra)) return null;
  return extra.value === undefined ? extra.label : strings.amount(extra.label, percent(amountOf(extra)));
};

const heldLines = (slots: ControllerSlots, extras: readonly ControllerExtra[], strings: ControllerStrings): string[] => [
  ...CONTROLLER_SLOT_IDS.map((id) => slotLine(slots, id, strings)),
  ...extras.map((extra) => extraLine(extra, strings)),
].filter((line): line is string => line !== null);

export { heldLines };
