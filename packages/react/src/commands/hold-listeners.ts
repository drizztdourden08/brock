/* @layer renderer-shell @kind logic */
import { releaseAllHolds } from './release-all-holds';
import { releaseHoldsForKey } from './release-holds-for-key';
import { clearModifiers } from './clear-modifiers';
import { trackModifiers } from './track-modifiers';

const track = (event: KeyboardEvent | PointerEvent): void => trackModifiers(event);

const lose = (): void => {
  clearModifiers();
  releaseAllHolds('blur');
};

const listenHolds = (): (() => void) => {
  const root = document.documentElement;
  const up = (event: KeyboardEvent): void => {
    track(event);
    releaseHoldsForKey(event);
  };
  const hidden = (): void => {
    if (document.visibilityState === 'hidden') lose();
  };
  root.addEventListener('keydown', track, true);
  root.addEventListener('keyup', up, true);
  root.addEventListener('pointerdown', track, true);
  root.addEventListener('pointermove', track, true);
  window.addEventListener('blur', lose);
  document.addEventListener('visibilitychange', hidden);
  return () => {
    root.removeEventListener('keydown', track, true);
    root.removeEventListener('keyup', up, true);
    root.removeEventListener('pointerdown', track, true);
    root.removeEventListener('pointermove', track, true);
    window.removeEventListener('blur', lose);
    document.removeEventListener('visibilitychange', hidden);
    clearModifiers();
    releaseAllHolds('dispose');
  };
};

export { listenHolds };
