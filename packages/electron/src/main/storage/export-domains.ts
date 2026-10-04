/* @layer electron-main @kind logic */
import { cp, mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { DataExportManifest, DataExportResult, DataManifestDomain } from '@drizztdourden08/brock-core/platform';
import { MANIFEST_FILE } from './storage.constants';
import type { WalkedFile } from './storage.type';
import type { ExportRequest } from './transfer.type';
import { walkFiles } from './walk-files';
import { createZipWriter } from './zip/create-zip-writer';
import type { ZipWriter } from './zip/zip.type';

const manifestOf = (request: ExportRequest, domains: DataManifestDomain[]): DataExportManifest => ({
  format: 'brock-data', version: 1, ...request.app, exportedAt: new Date().toISOString(), domains,
});

const zipDomain = async (zip: ZipWriter, id: string, files: readonly WalkedFile[], request: ExportRequest): Promise<void> => {
  for (const [index, file] of files.entries()) {
    request.signal?.throwIfAborted();
    await zip.add(`${id}/${file.rel}`, await readFile(file.full), new Date(file.mtimeMs));
    request.report?.(id, index + 1, files.length);
  }
};

const exportToZip = async (request: ExportRequest, walked: Map<string, WalkedFile[]>, manifest: DataExportManifest): Promise<void> => {
  const zip = await createZipWriter(request.target);
  try {
    for (const [id, files] of walked) await zipDomain(zip, id, files, request);
    await zip.add(MANIFEST_FILE, Buffer.from(JSON.stringify(manifest, null, 2)));
    await zip.close();
  } catch (err) {
    await zip.abort();
    throw err;
  }
};

const exportToFolder = async (request: ExportRequest, walked: Map<string, WalkedFile[]>, manifest: DataExportManifest): Promise<void> => {
  await mkdir(request.target, { recursive: true });
  for (const [id, files] of walked) {
    request.signal?.throwIfAborted();
    await cp(request.domains.domain(id).dir(), join(request.target, id), { recursive: true, force: true });
    request.report?.(id, files.length, files.length);
  }
  await writeFile(join(request.target, MANIFEST_FILE), JSON.stringify(manifest, null, 2));
};

const exportDomains = async (request: ExportRequest): Promise<DataExportResult> => {
  const walked = new Map<string, WalkedFile[]>();
  for (const id of request.ids) walked.set(id, await walkFiles(request.domains.domain(id).dir()));
  const domains = [...walked].map(([id, files]) => ({
    domain: id, label: request.domains.def(id).label, files: files.length, bytes: files.reduce((sum, file) => sum + file.bytes, 0),
  }));
  const manifest = manifestOf(request, domains);
  await (request.format === 'zip' ? exportToZip : exportToFolder)(request, walked, manifest);
  return {
    path: request.target,
    domains: domains.map((d) => d.domain),
    files: domains.reduce((sum, d) => sum + d.files, 0),
    bytes: domains.reduce((sum, d) => sum + d.bytes, 0),
  };
};

export { exportDomains };
