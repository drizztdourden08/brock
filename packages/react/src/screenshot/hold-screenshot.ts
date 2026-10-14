/* @layer renderer-shell @kind logic */
import { hostApi } from '../host/host-api';

const state = { count: 0 };

const report = (): void => {
  hostApi()?.captureHolds(state.count);
};

const holdScreenshot = (): (() => void) => {
  state.count += 1;
  report();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count -= 1;
    report();
  };
};

export { holdScreenshot };
