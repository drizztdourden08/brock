/* @layer renderer-shell @kind logic */
import type { EscapeStack } from '@drizztdourden08/tessera/primitives';

const shellTakesEscape = (event: Pick<KeyboardEvent, 'defaultPrevented'>, stack: EscapeStack): boolean => {
  if (event.defaultPrevented) return false;
  const top = stack.top();
  return top === null || top === 'screen';
};

export { shellTakesEscape };
