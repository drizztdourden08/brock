/* @layer renderer-shell @kind logic */
import { nativeHeld } from '../../native-held';
import { pointerGesture } from '../../pointer-gesture';
import { zonesAt } from '../../zones-at';
import { cancelLongPress } from './cancel-long-press';
import { startLongPress } from './start-long-press';

const secondaryDown = (event: PointerEvent): void => {
  const [first] = zonesAt(event.target);
  if (first === undefined || nativeHeld(event.target)) return;
  pointerGesture.down = {
    x: event.clientX,
    y: event.clientY,
    allowed: first.config.shouldOpen?.(event, first.data) !== false,
    release: first.config.openOn === 'release-without-drag',
  };
};

const onPointerDown = (event: PointerEvent): void => {
  const pending = pointerGesture.press !== null && pointerGesture.press.pointerId !== event.pointerId;
  pointerGesture.kind = event.pointerType;
  if (pending) {
    cancelLongPress();
    return;
  }
  if (event.pointerType === 'mouse') {
    pointerGesture.down = null;
    if (event.button === 2) secondaryDown(event);
    return;
  }
  startLongPress(event);
};

export { onPointerDown };
