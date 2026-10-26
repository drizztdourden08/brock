/* @layer renderer-shell @kind logic */
import { openAtTarget } from '../../open-at-target';
import { pointerGesture } from '../../pointer-gesture';
import { isCleanRelease } from './is-clean-release';
import { settlePress } from './settle-press';

const onPointerUp = (event: PointerEvent): void => {
  if (event.pointerType !== 'mouse') {
    settlePress(event);
    return;
  }
  const { down } = pointerGesture;
  if (down === null || !(event.target instanceof Element) || !isCleanRelease(event, down)) return;
  openAtTarget({ target: event.target, point: { x: event.clientX, y: event.clientY }, trigger: 'pointer' });
};

export { onPointerUp };
