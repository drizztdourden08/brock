/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, readdir, rm, stat, utimes, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { createDataDomains } from '../src/main/storage/create-data-domains';
import type { DataDomains } from '../src/main/storage/domain-files.type';
import { exportDomains } from '../src/main/storage/export-domains';
import { importDomains } from '../src/main/storage/import-domains';
import { readImportSource } from '../src/main/storage/read-import-source';
import { createZipWriter } from '../src/main/storage/zip/create-zip-writer';
import { endRecord } from '../src/main/storage/zip/end-record';
import { openZipReader } from '../src/main/storage/zip/open-zip-reader';
import { parseCentral } from '../src/main/storage/zip/parse-central';
import { zipHeader } from '../src/main/storage/zip/zip-header';

const APP = { app: 'test-app', appVersion: '1.2.3' };

let root = '';
let domains: DataDomains;

const fill = async (): Promise<void> => {
  await domains.domain('sessions').writeJson('runs/one.json', { seed: 1 });
  await domains.domain('sessions').writeText('runs/log.txt', 'x'.repeat(5000));
  await domains.domain('presets').writeBytes('p.bin', new Uint8Array([9, 8, 7]));
};

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'brock-transfer-'));
  domains = createDataDomains([
    { domain: 'sessions', label: 'Sessions', dir: 'data/sessions' },
    { domain: 'presets', label: 'Presets', dir: 'data/presets' },
  ], (dir) => join(root, dir));
  await fill();
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('zip writer and reader', () => {
  it('round-trips stored and deflated entries with their checksums', async () => {
    const path = join(root, 'plain.zip');
    const zip = await createZipWriter(path);
    await zip.add('a.txt', Buffer.from('a'));
    await zip.add('dir/b.txt', Buffer.from('b'.repeat(1000)));
    await zip.close();
    const reader = await openZipReader(path);
    expect(reader.records.map((record) => [record.name, record.method])).toEqual([['a.txt', 0], ['dir/b.txt', 8]]);
    const second = reader.records[1];
    if (!second) throw new Error('no second record');
    expect((await reader.read(second)).toString()).toBe('b'.repeat(1000));
    await reader.close();
  });

  it('writes zip64 records past 65535 files, and reads them back', async () => {
    const path = join(root, 'many.zip');
    const zip = await createZipWriter(path);
    const count = 65_540;
    for (let index = 0; index < count; index += 1) await zip.add(`f/${index}.txt`, Buffer.from(String(index)));
    await zip.close();
    const reader = await openZipReader(path);
    expect(reader.records).toHaveLength(count);
    const last = reader.records.at(-1);
    if (!last) throw new Error('no last record');
    expect(last.name).toBe(`f/${count - 1}.txt`);
    expect((await reader.read(last)).toString()).toBe(String(count - 1));
    await reader.close();
  }, 60_000);

  it('keeps sizes and offsets past 4 GB in the zip64 extra field', () => {
    const record = { name: 'big.bin', method: 0, crc: 1, compressed: 5_000_000_000, size: 5_000_000_000, offset: 6_000_000_000, time: 0, date: 33 };
    const central = zipHeader(record, 'central');
    expect(central.readUInt32LE(20)).toBe(0xffff_ffff);
    expect(central.readUInt16LE(4)).toBe(45);
    expect(parseCentral(central, 1)[0]).toMatchObject({ size: 5_000_000_000, compressed: 5_000_000_000, offset: 6_000_000_000 });
    const local = zipHeader(record, 'local');
    expect(local.readUInt16LE(28)).toBe(20);
    const small = zipHeader({ ...record, compressed: 3, size: 3, offset: 10 }, 'central');
    expect(small.readUInt16LE(30)).toBe(0);
    expect(endRecord(3, 100, 200)).toHaveLength(22);
    const wide = endRecord(3, 100, 5_000_000_000);
    expect(wide).toHaveLength(56 + 20 + 22);
    expect(wide.readBigUInt64LE(48)).toBe(5_000_000_000n);
    expect(wide.readBigUInt64LE(56 + 8)).toBe(5_000_000_100n);
  });

  it('refuses a file that is not a zip', async () => {
    const path = join(root, 'fake.zip');
    await writeFile(path, 'not a zip at all');
    await expect(openZipReader(path)).rejects.toThrow(/not a zip/);
  });
});

describe('exportDomains and importDomains', () => {
  it.each(['zip', 'folder'] as const)('exports chosen domains to a %s and imports them back over changed data', async (format) => {
    const target = join(root, format === 'zip' ? 'out.zip' : 'out');
    const steps: string[] = [];
    const result = await exportDomains({ domains, ids: ['sessions', 'presets'], format, target, app: APP, report: (id) => steps.push(id) });
    expect(result).toMatchObject({ path: target, domains: ['sessions', 'presets'], files: 3 });
    expect(result.bytes).toBeGreaterThan(5003);
    expect(new Set(steps)).toEqual(new Set(['sessions', 'presets']));

    await domains.domain('sessions').writeText('runs/extra.txt', 'later');
    await domains.domain('sessions').remove('runs/one.json');

    const from = await readImportSource(target, format);
    expect(from.manifest).toMatchObject({ format: 'brock-data', version: 1, app: 'test-app', appVersion: '1.2.3' });
    expect(from.manifest.domains.map((entry) => [entry.domain, entry.files])).toEqual([['sessions', 2], ['presets', 1]]);

    const imported = await importDomains({ domains, from, ids: ['sessions', 'unknown'] });
    expect(imported).toEqual({ domains: ['sessions'], files: 2, kept: 0 });
    expect(await domains.domain('sessions').readJson('runs/one.json', null)).toEqual({ seed: 1 });
    expect(await domains.domain('sessions').exists('runs/extra.txt')).toBe(false);
  });

  it.each(['zip', 'folder'] as const)('merges a %s into the data, keeping the newer file at the same path', async (format) => {
    const target = join(root, format === 'zip' ? 'merge.zip' : 'merge');
    const sessions = domains.domain('sessions');
    const past = new Date(Date.now() - 3_600_000);
    await utimes(join(sessions.dir(), 'runs/one.json'), past, past);
    await utimes(join(sessions.dir(), 'runs/log.txt'), past, past);
    await exportDomains({ domains, ids: ['sessions'], format, target, app: APP });
    await sessions.writeJson('runs/one.json', { seed: 2 });
    await utimes(join(sessions.dir(), 'runs/one.json'), new Date(past.getTime() - 3_600_000), new Date(past.getTime() - 3_600_000));
    await sessions.writeText('runs/mine.txt', 'only here');
    await sessions.writeText('runs/log.txt', 'newer here');

    const merged = await importDomains({ domains, from: await readImportSource(target, format), ids: ['sessions'], mode: 'merge' });
    expect(merged).toEqual({ domains: ['sessions'], files: 1, kept: 1 });
    expect(await sessions.readJson('runs/one.json', null)).toEqual({ seed: 1 });
    expect(await sessions.readText('runs/log.txt')).toBe('newer here');
    expect(await sessions.readText('runs/mine.txt')).toBe('only here');
    expect(Math.abs((await stat(join(sessions.dir(), 'runs/one.json'))).mtimeMs - past.getTime())).toBeLessThan(2_500);
  });

  it('refuses a folder or a zip without the manifest', async () => {
    await expect(readImportSource(root, 'folder')).rejects.toThrow(/ENOENT/);
    const path = join(root, 'other.zip');
    const zip = await createZipWriter(path);
    await zip.add('a.txt', Buffer.from('a'));
    await zip.close();
    await expect(readImportSource(path, 'zip')).rejects.toThrow(/not a Brock data export/);
  });

  it('stops when the signal is aborted', async () => {
    const controller = new AbortController();
    controller.abort(new Error('cancelled'));
    await expect(exportDomains({ domains, ids: ['sessions'], format: 'zip', target: join(root, 'x.zip'), app: APP, signal: controller.signal })).rejects.toThrow('cancelled');
    expect(await readdir(root)).not.toContain('x.zip');
  });
});
