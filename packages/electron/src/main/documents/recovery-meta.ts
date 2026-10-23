/* @layer electron-main @kind logic */
import type { RecoverableSnapshot } from '@drizztdourden08/brock-core/platform';
import { readOrNull } from '../storage/read-or-null';

const isMeta = (value: unknown): value is RecoverableSnapshot => {
  const meta = value as Partial<RecoverableSnapshot> | null;
  return typeof meta?.key === 'string' && typeof meta.savedAt === 'number' && typeof meta.size === 'number'
    && (meta.name === null || typeof meta.name === 'string') && (meta.path === null || typeof meta.path === 'string');
};

const readRecoveryMeta = async (file: string): Promise<RecoverableSnapshot | null> => {
  const raw = await readOrNull(file);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw.toString('utf8'));
    return isMeta(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export { readRecoveryMeta };
