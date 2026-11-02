/* @layer renderer-shell @kind logic */
import { downKeys } from './down-keys';
import { eventKeys } from './event-keys';
import { releaseAllHolds } from './release-all-holds';
import { releaseHoldsForKey } from './release-holds-for-key';
import { clearModifiers } from './clear-modifiers';
import { trackModifiers } from './track-modifiers';

const track = (event: KeyboardEvent | PointerEvent): void => trackModifiers(event);

const press = (event: KeyboardEvent): void => {
  downKeys.set(event.code, eventKeys(event));
  track(event);
};

const lose = (): void => {
  clearModifiers();
  downKeys.clear();
  releaseAllHolds('blur');
};

const listenHolds = (): (() => void) => {
  const root = document.documentElement;
  const up = (event: KeyboardEvent): void => {
    track(event);
    releaseHoldsForKey(event);
    downKeys.delete(event.code);
  };
  const hidden = (): void => {
    if (document.visibilityState === 'hidden') lose();
  };
  root.addEventListener('keydown', press, true);
  root.addEventListener('keyup', up, true);
  root.addEventListener('pointerdown', track, true);
  root.addEventListener('pointermove', track, true);
  window.addEventListener('blur', lose);
  document.addEventListener('visibilitychange', hidden);
  return () => {
    root.removeEventListener('keydown', press, true);
    root.removeEventListener('keyup', up, true);
    root.removeEventListener('pointerdown', track, true);
    root.removeEventListener('pointermove', track, true);
    window.removeEventListener('blur', lose);
    document.removeEventListener('visibilitychange', hidden);
    clearModifiers();
    downKeys.clear();
    releaseAllHolds('dispose');
  };
};

export { listenHolds };
