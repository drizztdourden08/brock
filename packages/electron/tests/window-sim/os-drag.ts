/* @layer electron-main @kind test */
import { vi } from 'vitest';
import { cursor } from './fake-electron';
import type { FakeWindow } from './fake-electron';
import type { DragEdge, DragOptions, DragStep, Rect, SimInsets } from './window-sim.type';

const MOVE_GRAB = { x: 80, y: 10 } as const;

const sidesOf = (edge: DragEdge) => ({ left: edge.includes('left'), right: edge.includes('right'), top: edge.includes('top'), bottom: edge.includes('bottom') });

const outer = (b: Rect, i: SimInsets): Rect => ({ x: b.x - i.left, y: b.y - i.top, width: b.width + i.left + i.right, height: b.height + i.top + i.bottom });
const inner = (r: Rect, i: SimInsets): Rect => ({ x: r.x + i.left, y: r.y + i.top, width: r.width - i.left - i.right, height: r.height - i.top - i.bottom });

const grabAlong = (start: number, length: number, near: boolean, far: boolean): number => {
  if (near) return start - 3;
  if (far) return start + length + 3;
  return start + Math.round(length / 2);
};

const grabPoint = (b: Rect, edge: DragEdge): { x: number; y: number } => {
  const s = sidesOf(edge);
  return { x: grabAlong(b.x, b.width, s.left, s.right), y: s.top ? b.y + 2 : grabAlong(b.y, b.height, false, s.bottom) };
};

interface Proposal {
  win: FakeWindow;
  edge: DragEdge;
  start: Rect;
  track: Rect;
  step: DragStep;
}

const proposalFor = ({ win, edge, start, track, step }: Proposal): Rect => {
  const s = sidesOf(edge);
  const { insets, min } = win;
  const minWidth = min.width + insets.left + insets.right;
  const minHeight = min.height + insets.top + insets.bottom;
  let left = s.left ? start.x + step.dx : track.x;
  let right = s.right ? start.x + start.width + step.dx : track.x + track.width;
  let top = s.top ? start.y + step.dy : track.y;
  let bottom = s.bottom ? start.y + start.height + step.dy : track.y + track.height;
  if (s.left) left = Math.min(left, right - minWidth);
  if (s.right) right = Math.max(right, left + minWidth);
  if (s.top) top = Math.min(top, bottom - minHeight);
  if (s.bottom) bottom = Math.max(bottom, top + minHeight);
  return { x: left, y: top, width: right - left, height: bottom - top };
};

const sizingStep = (win: FakeWindow, edge: DragEdge, proposed: Rect): Rect => {
  const event = {
    defaultPrevented: false,
    preventDefault(): void {
      this.defaultPrevented = true;
    },
  };
  win.emit('will-resize', event, { ...proposed }, { edge });
  if (!event.defaultPrevented) return proposed;
  win.pending = null;
  return outer(win.bounds, win.insets);
};

const resizeDrag = async (win: FakeWindow, edge: DragEdge, path: readonly DragStep[], options: DragOptions = {}): Promise<void> => {
  const stepMs = options.stepMs ?? 16;
  const start = outer(win.bounds, win.insets);
  const grab = grabPoint(win.bounds, edge);
  let track = { ...start };
  win.resizing = true;
  win.pending = null;
  const steps = [{ dx: 0, dy: 0 }, ...path];
  for (const [index, step] of steps.entries()) {
    cursor.x = grab.x + step.dx;
    cursor.y = grab.y + step.dy;
    const applied = sizingStep(win, edge, proposalFor({ win, edge, start, track, step }));
    win.place(inner(applied, win.insets));
    track = applied;
    await vi.advanceTimersByTimeAsync(stepMs);
    options.onStep?.(index);
  }
  win.resizing = false;
  if (options.cancel) win.place(inner(start, win.insets));
  win.emit('resized');
  const replay = win.takePending();
  if (replay) win.setBounds(replay);
  await vi.advanceTimersByTimeAsync(1000);
};

const moveDrag = async (win: FakeWindow, path: readonly DragStep[], options: DragOptions = {}): Promise<void> => {
  const stepMs = options.stepMs ?? 16;
  const start = { ...win.bounds };
  const grab = { x: start.x + MOVE_GRAB.x, y: start.y + MOVE_GRAB.y };
  for (const [index, step] of [{ dx: 0, dy: 0 }, ...path].entries()) {
    cursor.x = grab.x + step.dx;
    cursor.y = grab.y + step.dy;
    const proposed = { ...start, x: start.x + step.dx, y: start.y + step.dy };
    const event = {
      defaultPrevented: false,
      preventDefault(): void {
        this.defaultPrevented = true;
      },
    };
    win.emit('will-move', event, { ...proposed });
    if (!event.defaultPrevented) win.place(proposed);
    await vi.advanceTimersByTimeAsync(stepMs);
    options.onStep?.(index);
  }
  win.emit('moved');
  await vi.advanceTimersByTimeAsync(1000);
};

const line = (to: DragStep, count: number): DragStep[] =>
  Array.from({ length: count }, (_, index) => ({ dx: Math.round((to.dx * (index + 1)) / count), dy: Math.round((to.dy * (index + 1)) / count) }));

export { line, moveDrag, resizeDrag };
