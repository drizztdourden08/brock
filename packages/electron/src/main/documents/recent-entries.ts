/* @layer electron-main @kind logic */
import { readOrNull } from '../storage/read-or-null';
import type { StoredRecent } from './recent-documents.type';

const isEntry = (value: unknown): value is StoredRecent => {
  const entry = value as Partial<StoredRecent> | null;
  return typeof entry?.path === 'string' && typeof entry.name === 'string' && typeof entry.lastOpened === 'number' && typeof entry.sig === 'string';
};

const readRecentEntries = async (file: string): Promise<StoredRecent[]> => {
  const raw = await readOrNull(file);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw.toString('utf8'));
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
};

export { readRecentEntries };
