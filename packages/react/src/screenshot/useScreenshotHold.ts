/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { holdScreenshot } from './hold-screenshot';

const useScreenshotHold = (holding: boolean): void => {
  useEffect(() => (holding ? holdScreenshot() : undefined), [holding]);
};

export { useScreenshotHold };
