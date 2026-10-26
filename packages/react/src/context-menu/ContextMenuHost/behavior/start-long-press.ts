/* @layer renderer-shell @kind logic */
import { LONG_PRESS_MS } from '../../context-menu.constants';
import { openAtTarget } from '../../open-at-target';
import { pointerGesture } from '../../pointer-gesture';
import { cancelLongPress } from './cancel-long-press';

const startLongPress = (event: PointerEvent): void => {
  cancelLongPress();
  if (!(event.target instanceof Element)) return;
  const { pointerId, clientX: x, clientY: y, target } = event;
  const timer = window.setTimeout(() => {
    if (pointerGesture.press === null) return;
    pointerGesture.press.fired = true;
    openAtTarget({ target, point: { x, y }, trigger: 'longpress' });
  }, LONG_PRESS_MS);
  pointerGesture.press = { pointerId, x, y, target, timer, fired: false };
};

export { startLongPress };
