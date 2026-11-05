/* @layer electron-main @kind logic */
import { SEGMENT } from './recording-main.constants';

const recordingSegment = (name: string): string => {
  if (!SEGMENT.test(name)) throw new Error(`invalid recording name: ${name}`);
  return name;
};

export { recordingSegment };
