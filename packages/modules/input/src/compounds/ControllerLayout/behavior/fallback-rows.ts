/* @layer renderer-shell @kind logic */
import { ANALOG_IDS, CONTROLLER_SLOT_IDS, STICK_IDS } from '../ControllerLayout.constants';
import type { ControllerExtra, ControllerRow, ControllerSlotId, ControllerSlots, ControllerStrings } from '../ControllerLayout.type';
import { amountOf } from './amount-of';
import { isActive } from './is-active';
import { percent } from './percent';
import { slotName } from './slot-name';
import { stickMoved } from './stick-moved';

const slotRow = (slots: ControllerSlots, id: ControllerSlotId, strings: ControllerStrings): ControllerRow => {
  const state = slots[id];
  const analog = ANALOG_IDS.has(id) && state?.value !== undefined;
  return {
    id, label: slotName(slots, id, strings), glyph: state?.glyph,
    active: STICK_IDS.has(id) ? stickMoved(state) : isActive(state),
    amount: analog ? percent(amountOf(state)) : undefined,
  };
};

const extraRow = (extra: ControllerExtra): ControllerRow => ({
  id: extra.id, label: extra.label, glyph: extra.glyph, active: isActive(extra),
  amount: extra.value === undefined ? undefined : percent(amountOf(extra)),
});

const fallbackRows = (
  slots: ControllerSlots, placed: ReadonlySet<ControllerSlotId>, extras: readonly ControllerExtra[], strings: ControllerStrings,
): ControllerRow[] => [
  ...CONTROLLER_SLOT_IDS.filter((id) => slots[id] !== undefined && !placed.has(id)).map((id) => slotRow(slots, id, strings)),
  ...extras.map(extraRow),
];

export { fallbackRows };
