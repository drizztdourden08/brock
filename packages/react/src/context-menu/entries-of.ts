/* @layer renderer-shell @kind logic */
import type { ContextMenuConfig, ContextMenuContext, ContextMenuEntry } from './context-menu.type';

const entriesOf = (config: ContextMenuConfig, context: ContextMenuContext): readonly ContextMenuEntry[] =>
  (typeof config.entries === 'function' ? config.entries(context) : config.entries);

export { entriesOf };
