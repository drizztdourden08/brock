/* @layer electron-main @kind logic */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { SaveArchipelagoFilesRequest, SaveArchipelagoFilesResult } from '../../ipc/save-files.type';
import { pickFolder } from './pick-folder';
import { safeFileStem } from './safe-file-stem';
import { CANCELLED_REASON } from './save-files.constants';

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

const saveArchipelagoFiles = async (request: SaveArchipelagoFilesRequest): Promise<SaveArchipelagoFilesResult> => {
  const { slotName, yaml, apworld, moduleName } = request;
  const folder = await pickFolder();
  if (folder === null) return { ok: false, reason: CANCELLED_REASON };

  const yamlPath = join(folder, `${safeFileStem(slotName)}.yaml`);
  const worldPath = join(folder, `${safeFileStem(moduleName)}.apworld`);
  try {
    await writeFile(yamlPath, yaml, 'utf8');
    await writeFile(worldPath, Buffer.from(apworld));
  } catch (err) {
    return { ok: false, reason: messageOf(err) };
  }
  return { ok: true, folder, files: [yamlPath, worldPath] };
};

export { saveArchipelagoFiles };
