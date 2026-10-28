/* @layer electron-main @kind logic */
import { fromAppFrame } from './from-app-frame';
import type { FrameEvent } from './from-app-frame.type';

const assertAppFrame = (event: FrameEvent): void => {
  if (!fromAppFrame(event, { anyWindow: true })) throw new Error('Only the app window can use this channel');
};

export { assertAppFrame };
