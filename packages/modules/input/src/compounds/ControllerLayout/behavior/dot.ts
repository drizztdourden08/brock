/* @layer renderer-shell @kind logic */
import { circle } from './circle';
import { place } from './place';
import type { ControllerPlace, ControllerSlotId } from '../ControllerLayout.type';

const dot = (id: ControllerSlotId, cx: number, cy: number, r: number): ControllerPlace => place(id, 'button', circle(cx, cy, r), 'below');

export { dot };
