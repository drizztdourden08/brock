/* @layer renderer-shell @kind logic */
import { TOOLBAR_ID_ATTRIBUTE } from './toolbar.constants';

const toolbarIdOf = (target: Element | null): string | null => target?.closest(`[${TOOLBAR_ID_ATTRIBUTE}]`)?.getAttribute(TOOLBAR_ID_ATTRIBUTE) ?? null;

export { toolbarIdOf };
