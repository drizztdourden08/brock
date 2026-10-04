/* @layer renderer-shell @kind barrel */
export type { ScreenDef, ScreenHeader, ScreenLayerKind, ScreenRenderContext } from './screen.type';
export { defineScreen } from './define-screen';
export { createScreenRegistry } from './create-screen-registry';
export { ScreenRegistryContext } from './screen-registry-context';
export { useScreenRegistry } from './useScreenRegistry';
export type { ScreenRegistry } from './screen-registry.type';
export { matchesShortcut } from './matches-shortcut';
export { parseShortcut } from './parse-shortcut';
export type { ParsedShortcut } from './shortcuts.type';
export { ScreenLayer } from './ScreenLayer';
export type { ScreenLayerProps } from './ScreenLayer';
export { ScreenHost } from './ScreenHost';
export type { ScreenHostProps } from './ScreenHost';
export { defineScreens } from './conventions/define-screens';
export { buildScreenTree } from './conventions/build-screen-tree';
export { resolveScreenTree } from './conventions/resolve-screen-tree';
export { deriveMenu } from './conventions/derive-menu';
export type { BucketDef, BucketGroupDef, MenuPlacement, ScreenMeta, ScreensConfig, SettingsPlacement } from './conventions/screens-config.type';
export type {
  BucketEntry, CardEntry, HeroEntry, PageEntry, ResolvedScreenTree, ScreenEntry, ScreenTree, SettingsEntry, SettingsSource, TabEntry,
} from './conventions/screen-tree.type';
export type {
  CardProps, HeroActionsProps, HeroArtProps, HeroBackdropProps, HeroFactsProps, HeroFrame, HeroProps, HeroShadeProps, HeroSlotProps, HeroSlots, Open, PageProps,
} from './kinds/screen-kinds.type';
