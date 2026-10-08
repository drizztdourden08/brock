/* @layer electron-main @kind logic */
import type { InstalledRecord } from '../catalog.type';
import type { RegistryFile } from './installed-registry.type';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const filled = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

const namesOk = (value: Record<string, unknown>): boolean => [value.itemId, value.label, value.container, value.installedName].every(filled);

const isInstalledRecord = (value: unknown): value is InstalledRecord => isRecord(value) && namesOk(value)
  && typeof value.version === 'number' && typeof value.installedAt === 'number'
  && (value.kind === null || typeof value.kind === 'string') && isRecord(value.meta);

const emptyRegistry = (): RegistryFile => ({ version: 1, records: [] });

const parseRegistry = (text: string | null): RegistryFile => {
  if (!text) return emptyRegistry();
  try {
    const parsed = JSON.parse(text) as { version?: unknown; records?: unknown };
    if (parsed.version !== 1 || !Array.isArray(parsed.records)) return emptyRegistry();
    return { version: 1, records: parsed.records.filter(isInstalledRecord) };
  } catch {
    return emptyRegistry();
  }
};

export { parseRegistry };
