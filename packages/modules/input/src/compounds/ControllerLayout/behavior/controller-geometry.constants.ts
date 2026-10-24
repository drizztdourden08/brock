/* @layer renderer-shell @kind constants */
import { dot } from './dot';
import { dpad } from './dpad';
import { dpadHub } from './dpad-hub';
import { face } from './face';
import { pill } from './pill';
import { place } from './place';
import { rect } from './rect';
import { square } from './square';
import { stick } from './stick';
import type { ControllerGeometry, ControllerLayoutVariant, ControllerPlace } from '../ControllerLayout.type';

const GRIP_BODY = [
  'M 200 60 L 290 60 C 330 60 350 70 360 90 C 380 130 395 190 392 225 C 390 255 360 265 340 248',
  'C 320 230 300 200 270 195 L 130 195 C 100 200 80 230 60 248 C 40 265 10 255 8 225',
  'C 5 190 20 130 40 90 C 50 70 70 60 110 60 Z',
].join(' ');

const PAD_BODY = 'M 110 70 L 290 70 A 70 70 0 0 1 290 210 L 110 210 A 70 70 0 0 1 110 70 Z';

const TOP_ROW: ControllerPlace[] = [
  place('trigger.left', 'fill', rect({ x: 78, y: 8, w: 60, h: 30, r: 8 })),
  place('trigger.right', 'fill', rect({ x: 262, y: 8, w: 60, h: 30, r: 8 })),
  place('shoulder.left', 'fill', rect({ x: 64, y: 42, w: 88, h: 14, r: 7 })),
  place('shoulder.right', 'fill', rect({ x: 248, y: 42, w: 88, h: 14, r: 7 })),
];

const OFFSET_DECOR = [dpadHub(150, 160)];

const OFFSET_CONTROLS: ControllerPlace[] = [
  ...TOP_ROW, ...face(292, 112), ...dpad(150, 160),
  stick('left', 108, 112, 26), stick('right', 250, 160, 24),
];

const OFFSET: ControllerGeometry = {
  body: GRIP_BODY,
  decor: OFFSET_DECOR,
  places: [
    ...OFFSET_CONTROLS,
    pill('meta.view', 170, 100), pill('meta.menu', 230, 100), dot('meta.guide', 200, 80, 11), square('meta.capture', 200, 124),
  ],
};

const SYMMETRIC: ControllerGeometry = {
  body: GRIP_BODY,
  decor: [dpadHub(108, 112)],
  places: [
    ...TOP_ROW, ...face(292, 112), ...dpad(108, 112),
    stick('left', 158, 160, 24), stick('right', 242, 160, 24),
    pill('meta.view', 150, 82), pill('meta.menu', 250, 82), dot('meta.guide', 200, 162, 9), square('meta.capture', 200, 104),
  ],
};

const NINTENDO: ControllerGeometry = {
  body: GRIP_BODY,
  decor: OFFSET_DECOR,
  places: [
    ...OFFSET_CONTROLS,
    pill('meta.view', 170, 92), pill('meta.menu', 230, 92), square('meta.capture', 180, 122), dot('meta.guide', 220, 122, 9),
  ],
};

const PAD: ControllerGeometry = {
  body: PAD_BODY,
  decor: [dpadHub(110, 140)],
  places: [
    place('shoulder.left', 'fill', rect({ x: 70, y: 54, w: 100, h: 14, r: 7 })),
    place('shoulder.right', 'fill', rect({ x: 230, y: 54, w: 100, h: 14, r: 7 })),
    ...face(290, 140), ...dpad(110, 140),
    pill('meta.view', 180, 150), pill('meta.menu', 220, 150), dot('meta.guide', 200, 112, 9),
  ],
};

const GEOMETRY: Record<ControllerLayoutVariant, ControllerGeometry> = {
  offset: OFFSET, symmetric: SYMMETRIC, nintendo: NINTENDO, pad: PAD,
};

export { GEOMETRY };
