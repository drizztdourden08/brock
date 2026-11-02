/* @layer renderer-shell @kind logic */
import { nav } from '../navigation/nav';
import { scrollToAnchor } from '../search/scroll-to-anchor';
import { bindingKey } from './binding-key';
import type { ArgValue } from './command.type';
import { commands } from './commands';

const openKeymapAt = (route: string, commandId: string, args?: Readonly<Record<string, ArgValue>>): void => {
  nav.open(route);
  const anchor = args === undefined ? commandId : bindingKey(commandId, args);
  const label = commands.list({ includeHidden: true }).find((def) => def.id === commandId)?.label;
  scrollToAnchor(anchor, undefined, label ?? commandId);
};

export { openKeymapAt };
