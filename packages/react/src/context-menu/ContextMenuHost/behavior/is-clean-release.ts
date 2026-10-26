/* @layer renderer-shell @kind logic */
import { PRESS_SLOP } from '../../context-menu.constants';
import type { PointerDown } from '../../context-menu.type';

const isCleanRelease = (event: PointerEvent, down: PointerDown): boolean =>
  event.button === 2 && down.release && down.allowed && Math.hypot(event.clientX - down.x, event.clientY - down.y) <= PRESS_SLOP;

export { isCleanRelease };
