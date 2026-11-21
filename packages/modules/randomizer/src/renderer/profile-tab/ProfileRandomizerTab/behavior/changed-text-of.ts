/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import { ALL_DEFAULT_TEXT } from '../ProfileRandomizerTab.constants';

const changedTextOf = (changed: number, text: (value: Text) => string): string => {
  if (changed === 0) return text(ALL_DEFAULT_TEXT);
  return text(msg(changed === 1 ? 'randomizer:profile.differOne' : 'randomizer:profile.differMany', { count: changed }));
};

export { changedTextOf };
