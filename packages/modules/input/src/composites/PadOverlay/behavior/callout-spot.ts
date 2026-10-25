/* @layer renderer-components @kind logic */
import { TEXT_INSET, UNDERLINE_GAP } from '../PadOverlay.constants';
import type { Point } from '../PadOverlay.type';
import type { LabelSize, LabelSpot, Toward, Zone } from './placement.type';

const calloutSpot = (elbow: Point, toward: Toward, size: LabelSize, zone: Zone): LabelSpot => {
  const tailX = elbow.x + toward * (size.w + TEXT_INSET * 2);
  const farEnd = zone === 'above' || zone === 'below';
  const reading = farEnd ? -toward : toward;
  const textX = (farEnd ? tailX : elbow.x) + reading * TEXT_INSET;
  return {
    elbow,
    tail: { x: tailX, y: elbow.y },
    anchor: reading > 0 ? 'start' : 'end',
    nameAt: { x: textX, y: elbow.y - (size.up + UNDERLINE_GAP) / 2 },
    detailAt: { x: textX, y: elbow.y + (size.down + UNDERLINE_GAP) / 2 },
    rect: { left: Math.min(elbow.x, tailX), right: Math.max(elbow.x, tailX), top: elbow.y - size.up, bottom: elbow.y + size.down },
    zone,
  };
};

export { calloutSpot };
