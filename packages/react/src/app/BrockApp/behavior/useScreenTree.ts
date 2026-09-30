/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { resolveScreenTree } from '../../../screens/conventions/resolve-screen-tree';
import type { ResolvedScreenTree, ScreenTree } from '../../../screens/conventions/screen-tree.type';
import type { TabDef } from '../../../settings/settings.type';

const useScreenTree = (tree: ScreenTree | undefined, builtInTabs: readonly TabDef<object>[]): ResolvedScreenTree | null =>
  useMemo(() => (tree ? resolveScreenTree(tree, builtInTabs) : null), [tree, builtInTabs]);

export { useScreenTree };
