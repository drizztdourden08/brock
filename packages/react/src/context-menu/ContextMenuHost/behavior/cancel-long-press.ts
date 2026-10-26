/* @layer renderer-shell @kind logic */
import { pointerGesture } from '../../pointer-gesture';

const cancelLongPress = (): void => {
  if (pointerGesture.press !== null) window.clearTimeout(pointerGesture.press.timer);
  pointerGesture.press = null;
};

export { cancelLongPress };
