/* @layer renderer-shell @kind logic */
import type { ControllerShape } from '../ControllerLayout.type';

const circle = (cx: number, cy: number, r: number): ControllerShape => ({ kind: 'circle', cx, cy, r });

export { circle };
