/* @layer electron-main @kind logic */
import { bootState } from './boot-state';

const dismissSplash = (): void => {
  const { splash } = bootState;
  bootState.splash = null;
  if (splash && !splash.isDestroyed()) splash.destroy();
};

export { dismissSplash };
