/* @layer renderer-shell @kind logic */
import { ARM_W, HALF } from './controller-shapes.constants';
import { rect } from './rect';
import type { ControllerShape } from '../ControllerLayout.type';

const dpadHub = (cx: number, cy: number): ControllerShape => rect({ x: cx - HALF, y: cy - HALF, w: ARM_W, h: ARM_W, r: 0 });

export { dpadHub };
