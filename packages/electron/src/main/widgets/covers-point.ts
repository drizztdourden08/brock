/* @layer electron-main @kind logic */
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { pointWithin } from './point-within';
import type { CoverCandidate, StackPlace } from './widget-windows.type';

const above = (window: StackPlace, main: StackPlace): boolean => (window.onTop === main.onTop ? window.stamp > main.stamp : window.onTop);

const coversPoint = (point: WidgetWindowPoint, windows: readonly CoverCandidate[], main: StackPlace): boolean =>
  windows.some((window) => pointWithin(point, window.bounds) && above(window, main));

export { coversPoint };
