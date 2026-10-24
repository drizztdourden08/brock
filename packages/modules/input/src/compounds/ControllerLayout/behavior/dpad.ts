/* @layer renderer-shell @kind logic */
import { ARM_L, ARM_R, ARM_W, HALF } from './controller-shapes.constants';
import { place } from './place';
import { rect } from './rect';
import type { ControllerPlace } from '../ControllerLayout.type';

const arm = (x: number, y: number, w: number, h: number) => rect({ x, y, w, h, r: ARM_R });

const dpad = (cx: number, cy: number): ControllerPlace[] => [
  place('dpad.up', 'button', arm(cx - HALF, cy - HALF - ARM_L, ARM_W, ARM_L)),
  place('dpad.down', 'button', arm(cx - HALF, cy + HALF, ARM_W, ARM_L)),
  place('dpad.left', 'button', arm(cx - HALF - ARM_L, cy - HALF, ARM_L, ARM_W)),
  place('dpad.right', 'button', arm(cx + HALF, cy - HALF, ARM_L, ARM_W)),
];

export { dpad };
