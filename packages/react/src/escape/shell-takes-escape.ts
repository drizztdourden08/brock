/* @layer renderer-shell @kind logic */
import type { EscapeStack } from '@drizztdourden08/tessera/primitives';
import { CONCEALED_TITLE_BAR } from './escape.constants';

const inConcealedBar = (target: EventTarget | null): boolean => target instanceof Element && target.closest(CONCEALED_TITLE_BAR) !== null;

const shellTakesEscape = (event: Pick<KeyboardEvent, 'defaultPrevented'> & Partial<Pick<KeyboardEvent, 'target'>>, stack: EscapeStack): boolean => {
  if (event.defaultPrevented || inConcealedBar(event.target ?? null)) return false;
  const top = stack.top();
  return top === null || top === 'screen';
};

export { shellTakesEscape };
