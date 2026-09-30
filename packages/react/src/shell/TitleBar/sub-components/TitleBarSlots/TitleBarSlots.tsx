/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { NO_SLOTS } from '../../TitleBar.constants';
import type { TitleBarSlotsProps } from './TitleBarSlots.type';
import './TitleBarSlots.css';

const TitleBarSlots = (props: TitleBarSlotsProps) => {
  const { slots = NO_SLOTS } = props;
  return slots.map((Slot, index) => (
    <Box key={Slot.displayName ?? index} className={Slot.conditional ? 'titlebar__slot titlebar__slot--conditional' : 'titlebar__slot'}>
      <Slot />
    </Box>
  ));
};

export { TitleBarSlots };
