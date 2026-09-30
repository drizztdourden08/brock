/* @layer electron-main @kind logic */
import { getMainWindow } from '../window/get-main-window';

const mainOnTop = (): boolean => {
  const main = getMainWindow();
  return main !== null && !main.isDestroyed() && main.isAlwaysOnTop();
};

export { mainOnTop };
