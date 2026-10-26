/* @layer renderer-shell @kind logic */
import { pointerGesture } from '../../pointer-gesture';
import { cancelLongPress } from './cancel-long-press';

const settlePress = (event: PointerEvent): void => {
  const { press } = pointerGesture;
  if (press?.pointerId === event.pointerId && !press.fired) cancelLongPress();
};

export { settlePress };
