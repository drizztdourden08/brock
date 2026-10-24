/* @layer renderer-shell @kind logic */
import { circle } from './circle';
import { FACE_GAP, FACE_R } from './controller-shapes.constants';
import { place } from './place';
import type { ControllerPlace } from '../ControllerLayout.type';

const face = (cx: number, cy: number): ControllerPlace[] => [
  place('face.north', 'button', circle(cx, cy - FACE_GAP, FACE_R)),
  place('face.east', 'button', circle(cx + FACE_GAP, cy, FACE_R)),
  place('face.south', 'button', circle(cx, cy + FACE_GAP, FACE_R)),
  place('face.west', 'button', circle(cx - FACE_GAP, cy, FACE_R)),
];

export { face };
