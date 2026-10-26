/* @layer renderer-shell @kind logic */
import type { ContextMenuFlag } from './context-menu.type';

const flagOf = (flag: ContextMenuFlag | undefined): boolean | undefined => (typeof flag === 'function' ? flag() : flag);

export { flagOf };
