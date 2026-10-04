/* @layer electron-main @kind logic */
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { DataExportFormat, DataExportManifest } from '@drizztdourden08/brock-core/platform';
import { stripBom } from '@drizztdourden08/brock-core/storage';
import { MANIFEST_FILE } from './storage.constants';
import type { ImportSource } from './transfer.type';
import { openZipReader } from './zip/open-zip-reader';

const manifestText = async (source: string, format: DataExportFormat): Promise<string> => {
  if (format === 'folder') return readFile(join(source, MANIFEST_FILE), 'utf8');
  const zip = await openZipReader(source);
  try {
    const record = zip.records.find((entry) => entry.name === MANIFEST_FILE);
    if (!record) throw new Error(`${source} is not a Brock data export: it has no ${MANIFEST_FILE}`);
    return (await zip.read(record)).toString('utf8');
  } finally {
    await zip.close();
  }
};

const isManifest = (value: unknown): value is DataExportManifest => {
  const manifest = value as Partial<DataExportManifest> | null;
  return manifest?.format === 'brock-data' && Array.isArray(manifest.domains);
};

const readImportSource = async (source: string, format: DataExportFormat): Promise<ImportSource> => {
  const parsed: unknown = JSON.parse(stripBom(await manifestText(source, format)));
  if (!isManifest(parsed)) throw new Error(`${source} is not a Brock data export`);
  return { source, format, manifest: parsed };
};

export { readImportSource };
