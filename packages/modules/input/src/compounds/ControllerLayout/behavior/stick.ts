/* @layer renderer-shell @kind logic */
import { circle } from './circle';
import { place } from './place';
import type { ControllerPlace } from '../ControllerLayout.type';
import type { StickSide } from './stick.type';

const stick = (side: StickSide, cx: number, cy: number, r: number): ControllerPlace =>
  place(`stick.${side}`, 'stick', circle(cx, cy, r), 'below');

export { stick };
