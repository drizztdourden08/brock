/* @layer renderer-shell @kind logic */
import type { ControllerPlace, ControllerSlotState, ControllerSlots } from '../ControllerLayout.type';
import { isActive } from './is-active';
import { stickClickState } from './stick-click-state';
import { stickMoved } from './stick-moved';
import type { TagSource } from './tag-source.type';

const hasContent = (state: ControllerSlotState | undefined): boolean =>
  state !== undefined && ((state.glyph !== undefined && state.glyph !== null) || (state.label !== undefined && state.label !== ''));

const tagSource = (place: ControllerPlace, slots: ControllerSlots): TagSource => {
  const state = slots[place.id];
  if (place.kind !== 'stick') return { state, active: isActive(state) };
  const click = stickClickState(slots, place.id);
  return { state: hasContent(state) ? state : click, active: stickMoved(state) || isActive(click) };
};

export { tagSource };
