/* @layer renderer-shell @kind logic */
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import type { TitleBarExpectation } from '../review.type';

const viewMenuLabels = (controls: TitleBarExpectation['controls']): string[] => {
  const { windows } = TESSERA_STRINGS;
  return [...(controls?.pin ? [windows.pinOnTop] : []), ...(controls?.fullscreen ? [windows.fullscreen] : [])];
};

export { viewMenuLabels };
