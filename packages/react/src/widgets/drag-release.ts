/* @layer renderer-shell @kind logic */
import { DRAG_SLOP_PX } from './widget.constants';

let start: { x: number; y: number } | null = null;
let releasing = false;

const onDown = (event: PointerEvent): void => {
  start = { x: event.screenX, y: event.screenY };
};

const onUp = (event: PointerEvent): void => {
  releasing = start !== null && Math.hypot(event.screenX - start.x, event.screenY - start.y) > DRAG_SLOP_PX;
  start = null;
  setTimeout(() => { releasing = false; }, 0);
};

const watch = (view: Window): (() => void) => {
  view.addEventListener('pointerdown', onDown, true);
  view.addEventListener('pointerup', onUp, true);
  return () => {
    view.removeEventListener('pointerdown', onDown, true);
    view.removeEventListener('pointerup', onUp, true);
  };
};

const dragRelease = { watch, releasing: (): boolean => releasing };

export { dragRelease };
