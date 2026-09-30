/* @layer renderer-shell @kind logic */
import { framePainted } from './frame-painted';

const firstFrameSignal = framePainted();

export { firstFrameSignal };
