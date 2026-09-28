/* @layer core @kind barrel */
export { DEFAULT_BASE_SETTINGS } from './base-settings.constants';
export { mergeSettings } from './merge-settings';
export type { BaseSettings, WindowMode } from './base-settings.type';
export { createFeatureResolver } from './features/resolver';
export type { FeatureResolver } from './features/resolver.type';
export type { BaseFeatureDef, ResolveResult } from './features/feature.type';
export { createSettingLock } from './features/setting-lock';
export type { SettingLock } from './features/setting-lock.type';
