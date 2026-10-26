/* @layer renderer-shell @kind logic */
import type { CommandTrigger } from '../../../commands/command.type';
import { openAtTarget } from '../../open-at-target';
import { pointerGesture } from '../../pointer-gesture';
import { cancelLongPress } from './cancel-long-press';
import { isSwallowed } from './is-swallowed';

const triggerOf = (event: MouseEvent): CommandTrigger => {
  if (event.clientX === 0 && event.clientY === 0 && pointerGesture.down === null) return 'keyboard';
  return pointerGesture.kind === 'mouse' ? 'pointer' : 'longpress';
};

const onContextMenu = (event: MouseEvent): void => {
  if (event.defaultPrevented || !(event.target instanceof Element)) return;
  const trigger = triggerOf(event);
  if (isSwallowed(event, trigger)) {
    event.preventDefault();
    return;
  }
  const point = trigger === 'keyboard' ? null : { x: event.clientX, y: event.clientY };
  if (openAtTarget({ target: event.target, point, trigger }) === 'none') return;
  event.preventDefault();
  if (trigger === 'longpress') cancelLongPress();
};

export { onContextMenu };
