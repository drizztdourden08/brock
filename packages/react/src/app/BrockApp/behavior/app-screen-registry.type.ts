/* @layer renderer-shell @kind types */
import type { ModuleBucket } from '../../../modules/renderer-module.type';
import type { ResolvedScreenTree } from '../../../screens/conventions/screen-tree.type';
import type { ScreenDef } from '../../../screens/screen.type';
import type { AppScreensInput } from '../BrockApp.type';

interface AppScreenRegistryInput extends Pick<AppScreensInput, 'credits' | 'legalText' | 'profilesRoute' | 'singleProfile'> {
  screens: readonly ScreenDef[];
  tree: ResolvedScreenTree | null;
  moduleScreens: readonly ScreenDef[];
  moduleBuckets: readonly ModuleBucket[];
}

export type { AppScreenRegistryInput };
