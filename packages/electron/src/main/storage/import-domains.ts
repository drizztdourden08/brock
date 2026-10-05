/* @layer electron-main @kind logic */
import { copyFile, mkdir, utimes, writeFile } from 'fs/promises';
import { dirname } from 'path';
import type { DataImportResult } from '@drizztdourden08/brock-core/platform';
import { cleanDir } from './clean-dir';
import type { Incoming, Placed } from './import-domains.type';
import { keepsExisting } from './keeps-existing';
import { resolveInside } from './resolve-inside';
import type { ImportRequest } from './transfer.type';
import { walkFiles } from './walk-files';
import { dosDate } from './zip/dos-date';
import { openZipReader } from './zip/open-zip-reader';

const place = async (request: ImportRequest, id: string, dir: string, incoming: readonly Incoming[]): Promise<Placed> => {
  const merge = request.mode === 'merge';
  let kept = 0;
  for (const [index, file] of incoming.entries()) {
    request.signal?.throwIfAborted();
    const full = resolveInside(dir, file.rel);
    if (merge && await keepsExisting(full, file.modified)) kept += 1;
    else {
      await mkdir(dirname(full), { recursive: true });
      await file.write(full);
      await utimes(full, file.modified, file.modified);
    }
    request.report?.(id, index + 1, incoming.length);
  }
  return { files: incoming.length - kept, kept };
};

const fromZip = async (request: ImportRequest, id: string, dir: string): Promise<Placed> => {
  const zip = await openZipReader(request.from.source);
  try {
    const prefix = `${id}/`;
    const incoming = zip.records.filter((record) => record.name.startsWith(prefix) && !record.name.endsWith('/')).map((record): Incoming => ({
      rel: record.name.slice(prefix.length),
      modified: dosDate(record.date, record.time),
      write: async (full) => writeFile(full, await zip.read(record)),
    }));
    return await place(request, id, dir, incoming);
  } finally {
    await zip.close();
  }
};

const fromFolder = async (request: ImportRequest, id: string, dir: string): Promise<Placed> => {
  const walked = await walkFiles(resolveInside(request.from.source, id));
  return place(request, id, dir, walked.map((file): Incoming => ({ rel: file.rel, modified: new Date(file.mtimeMs), write: (full) => copyFile(file.full, full) })));
};

const importDomains = async (request: ImportRequest): Promise<DataImportResult> => {
  const listed = new Set(request.from.manifest.domains.map((entry) => entry.domain));
  const known = new Set(request.domains.list().map((def) => def.domain));
  const chosen = request.ids.filter((id) => listed.has(id) && known.has(id));
  const total: Placed = { files: 0, kept: 0 };
  for (const id of chosen) {
    request.signal?.throwIfAborted();
    const dir = request.domains.domain(id).dir();
    if (request.mode !== 'merge') await cleanDir(dir, null);
    await mkdir(dir, { recursive: true });
    const placed = await (request.from.format === 'zip' ? fromZip : fromFolder)(request, id, dir);
    total.files += placed.files;
    total.kept += placed.kept;
  }
  return { domains: chosen, ...total };
};

export { importDomains };
