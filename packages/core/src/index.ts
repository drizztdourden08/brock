/* @layer core @kind barrel */
export * from './product';
export * from './ipc';
export * from './platform';
export * from './storage';
export * from './settings';
export * from './log';
export * from './module';
export * from './types';
export * from './format';
export * from './result';
export { createRegistry } from './registry/registry';
export type { Registry } from './registry/registry.type';
export { createAutomationFlags } from './automation/flags';
export { BASE_AUTOMATION_FLAGS, IDENTITY_FLAGS } from './automation/flags.constants';
export type { AutomationFlags } from './automation/flags.type';
