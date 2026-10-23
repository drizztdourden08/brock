/* @layer renderer-shell @kind logic */
import { commands } from '../commands/commands';
import type { TitleBarButtonSpec } from './title-bar-item.type';

const selectButton = (spec: Pick<TitleBarButtonSpec, 'onSelect' | 'command'>): void => {
  if (spec.onSelect !== undefined) spec.onSelect();
  else if (spec.command !== undefined) commands.run(spec.command);
};

export { selectButton };
