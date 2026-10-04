/* @layer electron-main @kind logic */
import { TOW_HOLD_MS } from './widget-windows.constants';

let until = 0;

const towHold = {
  hold: (): void => {
    until = Date.now() + TOW_HOLD_MS;
  },
  held: (): boolean => Date.now() < until,
};

export { towHold };
