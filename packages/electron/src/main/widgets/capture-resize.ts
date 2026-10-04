/* @layer electron-main @kind logic */
import { lineFollowers } from './line-followers';
import { RESIZE_SIDES } from './widget-windows.constants';
import type { ResizeSession, ResizeStart } from './widget-windows.type';

const captureResize = ({ others, ...start }: ResizeStart): ResizeSession => {
  const followers = RESIZE_SIDES.flatMap((side) => lineFollowers(start.start, side, others));
  return { ...start, last: start.start, followers, around: others.map(({ id, bounds }) => ({ id, bounds })) };
};

export { captureResize };
