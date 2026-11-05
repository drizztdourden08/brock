/* @layer renderer-shell @kind logic */
import { ALL_DEFAULT_TEXT } from '../ProfileRandomizerTab.constants';

const changedTextOf = (changed: number): string => {
  if (changed === 0) return ALL_DEFAULT_TEXT;
  return `${changed} option${changed === 1 ? '' : 's'} differ from the default.`;
};

export { changedTextOf };
