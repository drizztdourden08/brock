/* @layer renderer-shell @kind barrel */
export type {
  LockOverlayProps, RenderControl, Section, SettingAction, SettingChoice, SettingChoiceLook, SettingControl, SettingControlKind, SettingDescription, SettingItem, SettingItemFields, SettingJsonShape, SettingLayout, SettingLockCause,
  SettingsControlProps, SettingsLayoutProps, SettingsPatch, SettingsPreviewPlacement, SettingsValueSource, SubSection, TabDef, TabRenderContext,
} from './settings.type';
export { createTabRegistry } from './tab-registry';
export { moduleTabId } from './module-tab-id';
export { settingsApi as settings } from './api/settings-api';
export { settingsCatalog } from './api/settings-catalog';
export type { CatalogChoice, CatalogControl, CatalogItem, CatalogScreen, CatalogSection, CatalogSubSection, SettingSetFailure, SettingSetResult } from './api/settings-catalog.type';
export type { TabRegistry } from './tab-registry.type';
export * from './SettingsLayout';
export * from './SettingsHub';
