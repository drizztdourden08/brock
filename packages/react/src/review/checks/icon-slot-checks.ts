/* @layer renderer-shell @kind logic */
import type { IconSlotSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const iconSlotChecks = (id: string, slots: readonly IconSlotSnapshot[], isIconName: (text: string) => boolean): ReviewOutcome[] => {
  const raw = slots.filter((slot) => !slot.hasElement && isIconName(slot.text));
  const named = raw.map((slot) => `${slot.label} ("${slot.text}")`).join(', ');
  return [outcome(id, raw.length === 0, `${slots.length} icons render as images`, `icon names shown as text on ${named}`)];
};

export { iconSlotChecks };
