/* @layer electron-main @kind logic */
import { edgeWindows } from './edge-windows';
import type { SnapTarget } from './widget-windows.type';

const snapTargets = (id: string): SnapTarget[] => edgeWindows(id).map((window) => ({ to: window.id, bounds: window.bounds }));

export { snapTargets };
