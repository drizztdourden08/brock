/* @layer renderer-shell @kind component */
import { NO_SLOTS } from '../../TitleBar.constants';
import type { TitleBarSlotsProps } from './TitleBarSlots.type';

const TitleBarSlots = (props: TitleBarSlotsProps) => {
  const { slots = NO_SLOTS } = props;
  return slots.map((Slot, index) => <Slot key={Slot.displayName ?? index} />);
};

export { TitleBarSlots };
