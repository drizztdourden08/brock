/* @layer renderer-shell @kind logic */
import { openAtTarget } from './open-at-target';

const openFromFocus = (): void => {
  const target = document.activeElement;
  if (target !== null) openAtTarget({ target, point: null, trigger: 'keyboard' });
};

export { openFromFocus };
