/* @layer electron-main @kind logic */
import type { RecentDocument } from '@drizztdourden08/brock-core/platform';
import { readOrNull } from '../storage/read-or-null';

const isEntry = (value: unknown): value is RecentDocument => {
  const entry = value as Partial<RecentDocument> | null;
  return typeof entry?.path === 'string' && typeof entry.name === 'string' && typeof entry.lastOpened === 'number';
};

const readRecentEntries = async (file: string): Promise<RecentDocument[]> => {
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
