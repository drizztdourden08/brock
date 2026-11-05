/* @layer renderer-components @kind logic */
import type { RefObject } from 'react';
import { FOCUS_DEADLINE_MS, FOCUS_MAX_ATTEMPTS } from '../ControlsSettings.constants';

const isUsable = (input: HTMLInputElement): boolean =>
  input.isConnected &&
  !input.closest('[inert], [aria-hidden="true"]') &&
  input.getClientRects().length > 0 &&
  getComputedStyle(input).visibility === 'visible';

/** Focuses and selects the input once it is visible; returns the cancel function. */
const focusInputWhenReady = (inputRef: RefObject<HTMLInputElement | null>): (() => void) => {
  let frame = 0;
  let attempts = 0;
  const deadline = performance.now() + FOCUS_DEADLINE_MS;
  const tryFocus = () => {
    const input = inputRef.current;
    if (input && isUsable(input)) {
      input.focus();
      if (document.activeElement === input) {
        input.select();
        return;
      }
    }
    attempts += 1;
    if (attempts < FOCUS_MAX_ATTEMPTS && performance.now() < deadline) {
      frame = requestAnimationFrame(tryFocus);
    }
  };
  tryFocus();
  return () => cancelAnimationFrame(frame);
};

export { focusInputWhenReady };
