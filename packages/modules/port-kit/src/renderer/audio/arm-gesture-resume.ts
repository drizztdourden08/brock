/* @layer renderer-shell @kind logic */
import { GESTURE_EVENTS } from './audio.constants';

const armGestureResume = (context: AudioContext): (() => void) => {
  const disarm = (): void => {
    for (const name of GESTURE_EVENTS) window.removeEventListener(name, handleGesture, true);
  };
  const handleGesture = (): void => {
    if (context.state === 'running' || context.state === 'closed') {
      disarm();
      return;
    }
    context.resume().then(disarm, () => undefined);
  };
  for (const name of GESTURE_EVENTS) window.addEventListener(name, handleGesture, { capture: true, passive: true });
  handleGesture();
  return disarm;
};

export { armGestureResume };
