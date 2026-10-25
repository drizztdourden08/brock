/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { ModuleBucket } from '../../../modules/renderer-module.type';
import { resolveScreenTree } from '../../../screens/conventions/resolve-screen-tree';
import type { ResolvedScreenTree, ScreenTree } from '../../../screens/conventions/screen-tree.type';
import { withModuleBuckets } from '../../../screens/conventions/with-module-buckets';
import type { TabDef } from '../../../settings/settings.type';

const useScreenTree = (tree: ScreenTree | undefined, builtInTabs: readonly TabDef<object>[], moduleBuckets: readonly ModuleBucket[]): ResolvedScreenTree | null =>
  useMemo(() => (tree ? resolveScreenTree(withModuleBuckets(tree, moduleBuckets), builtInTabs) : null), [tree, builtInTabs, moduleBuckets]);

export { useScreenTree };
