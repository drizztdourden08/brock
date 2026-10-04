/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { resizeEdges } from './resize-edges';
import { resizeSides } from './resize-sides';
import { PROBE_BORDERS, PROBE_RESIZE_STEPS, RESIZE_SIDES } from './widget-windows.constants';

const outer = (b: WidgetWindowBounds): WidgetWindowBounds => ({
  x: b.x - PROBE_BORDERS.left, y: b.y - PROBE_BORDERS.top, width: b.width + PROBE_BORDERS.left + PROBE_BORDERS.right, height: b.height + PROBE_BORDERS.top + PROBE_BORDERS.bottom,
});

const driveResize = (win: BrowserWindow, target: WidgetWindowBounds): void => {
  const from = outer(boundsOf(win));
  const to = outer(target);
  const sides = resizeEdges(from, to);
  const edge = resizeSides.nameOf(sides);
  if (edge === '') return;
  for (let step = 0; step <= PROBE_RESIZE_STEPS; step += 1) {
    const proposed = RESIZE_SIDES.filter((side) => sides[side]).reduce((b, side) => {
      const start = resizeSides.lineOf(from, side);
      return resizeSides.withLine(b, side, Math.round(start + ((resizeSides.lineOf(to, side) - start) * step) / PROBE_RESIZE_STEPS));
    }, from);
    win.emit('will-resize', { preventDefault: () => undefined }, proposed, { edge });
  }
  win.emit('resized');
};

export { driveResize };
