/* @layer core @kind logic */
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { SaveSlotPaths, SaveSlotRef } from './save-slot.type';
import { QUICK_DIR, SCREENSHOT_EXTENSION, STATE_EXTENSION } from './save-slot.constants';
import { savesDirOf } from './saves-dir-of';

const stemOf = (ref: SaveSlotRef): string => {
  if (ref.kind !== 'quick') return assertSafeName(ref.id, 'save id');
  if (!Number.isInteger(ref.slot) || ref.slot < 0) throw new Error(`Quick slot must be a whole number from 0, got ${ref.slot}.`);
  return `save${ref.slot}`;
};

const saveSlotPaths = (profileId: string, ref: SaveSlotRef): SaveSlotPaths => {
  const dir = savesDirOf(profileId, ref.kind === 'quick' ? QUICK_DIR : ref.kind);
  const stem = stemOf(ref);
  return { state: `${dir}/${stem}${STATE_EXTENSION}`, screenshot: `${dir}/${stem}${SCREENSHOT_EXTENSION}` };
};

export { saveSlotPaths };
