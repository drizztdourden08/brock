/* @layer renderer-shell @kind logic */
import type { MsuStore } from '../../store/msu-store.type';
import { extensionOf, stemOf, uniqueFileName } from './track-file-name';

const parkFile = async (store: MsuStore, pack: string, fileName: string, taken: Set<string>): Promise<string> => {
  const parked = uniqueFileName(`${stemOf(fileName)}-unused.${extensionOf(fileName)}`, taken);
  await store.renameMsuTrackFile(pack, fileName, parked);
  taken.add(parked);
  taken.delete(fileName);
  return parked;
};

export { parkFile };
