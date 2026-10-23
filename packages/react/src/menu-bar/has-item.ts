/* @layer renderer-shell @kind logic */
import type { MenuNode } from '@drizztdourden08/tessera/composites';

const hasItem = (nodes: readonly MenuNode[]): boolean => nodes.some((node) => !('separator' in node));

export { hasItem };
