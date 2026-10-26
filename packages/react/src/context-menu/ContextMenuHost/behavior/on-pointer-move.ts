/* @layer renderer-shell @kind logic */
import { PRESS_SLOP } from '../../context-menu.constants';
import { pointerGesture } from '../../pointer-gesture';
import { cancelLongPress } from './cancel-long-press';

const onPointerMove = (event: PointerEvent): void => {
  const { press } = pointerGesture;
  if (press?.pointerId !== event.pointerId) return;
  if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > PRESS_SLOP) cancelLongPress();
};

export { onPointerMove };
