/* @layer electron-main @kind logic */
import type { RegistryRemoval, RegistryValue } from './os-integration.type';

const valueArgs = (name: string | null): string[] => (name === null ? ['/ve'] : ['/v', name]);

const regArgs = (entry: RegistryValue | RegistryRemoval): string[] => {
  if ('value' in entry) return ['add', entry.key, ...valueArgs(entry.name), '/t', 'REG_SZ', '/d', entry.value, '/f'];
  return ['delete', entry.key, ...(entry.name === null ? [] : ['/v', entry.name]), '/f'];
};

export { regArgs };
