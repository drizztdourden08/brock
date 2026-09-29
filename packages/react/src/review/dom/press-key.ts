/* @layer renderer-shell @kind logic */
import type { KeyChord } from '../review.type';

const press = (chord: KeyChord): void => {
  const target = document.activeElement ?? document.body;
  const init = { bubbles: true, cancelable: true, key: chord.key, ctrlKey: chord.ctrlKey === true };
  target.dispatchEvent(new KeyboardEvent('keydown', init));
  target.dispatchEvent(new KeyboardEvent('keyup', init));
};

export { press };
