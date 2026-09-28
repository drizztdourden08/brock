/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { QuickSlotInfo, SaveSlotRef } from './save-slot.type';
import type { SlotStore, SlotWrite } from './save-store.type';
import { QUICK_DIR } from './save-slot.constants';
import { quickSlotOf } from './quick-slot-of';
import { saveSlotPaths } from './save-slot-paths';
import { savesDirOf } from './saves-dir-of';

const dirOf = (path: string): string => path.slice(0, path.lastIndexOf('/'));

const createSlotStore = (files: FileStore): SlotStore => {
  const write = async (profileId: string, ref: SaveSlotRef, { bytes, screenshot }: SlotWrite): Promise<void> => {
    const paths = saveSlotPaths(profileId, ref);
    await files.mkdir(dirOf(paths.state));
    await files.writeBytes(paths.state, bytes);
    if (screenshot) await files.writeBytes(paths.screenshot, screenshot);
    else await files.remove(paths.screenshot);
  };

  const read = (profileId: string, ref: SaveSlotRef): Promise<Uint8Array | null> =>
    files.readBytes(saveSlotPaths(profileId, ref).state);

  const readScreenshot = (profileId: string, ref: SaveSlotRef): Promise<Uint8Array | null> =>
    files.readBytes(saveSlotPaths(profileId, ref).screenshot);

  const remove = async (profileId: string, ref: SaveSlotRef): Promise<void> => {
    const paths = saveSlotPaths(profileId, ref);
    await files.remove(paths.state);
    await files.remove(paths.screenshot);
  };

  const infoOf = async (profileId: string, slot: number): Promise<QuickSlotInfo | null> => {
    const paths = saveSlotPaths(profileId, { kind: 'quick', slot });
    const stat = await files.stat(paths.state);
    if (!stat) return null;
    return { slot, savedAt: stat.mtimeMs, hasScreenshot: await files.exists(paths.screenshot) };
  };

  const listQuick = async (profileId: string): Promise<QuickSlotInfo[]> => {
    const names = await files.list(savesDirOf(profileId, QUICK_DIR));
    const slots = names.map(quickSlotOf).filter((slot): slot is number => slot !== null).sort((a, b) => a - b);
    const infos = await Promise.all(slots.map((slot) => infoOf(profileId, slot)));
    return infos.filter((info): info is QuickSlotInfo => info !== null);
  };

  return { write, read, readScreenshot, remove, listQuick };
};

export { createSlotStore };
