/* @layer core @kind logic */
import { isZip, unzip } from '../archive';
import type { ArchiveEntry } from '../archive';
import { MSUL_MANIFEST_NAME } from '../manifest-io';
import type { MsulPack } from './import-msul.type';
import { parsePackJson } from './parse-pack-json';

const readMsulPack = async (bytes: Uint8Array): Promise<MsulPack> => {
  if (!isZip(bytes)) {
    throw new Error('That file is not a layered MSU pack. A .msul file is an archive, and this one is not.');
  }
  let entries: ArchiveEntry[];
  try {
    entries = await unzip(bytes);
  } catch {
    throw new Error('This pack could not be opened. The archive appears to be incomplete or damaged.');
  }
  const manifestEntry = entries.find((entry) => entry.name === MSUL_MANIFEST_NAME);
  if (!manifestEntry) {
    throw new Error(`This archive has no ${MSUL_MANIFEST_NAME}, so it is not a layered MSU pack.`);
  }
  return {
    manifest: parsePackJson(new TextDecoder().decode(manifestEntry.bytes)),
    files: entries.filter((entry) => entry !== manifestEntry),
  };
};

export { readMsulPack };
