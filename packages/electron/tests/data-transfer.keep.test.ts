/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, readdir, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { createDataDomains } from '../src/main/storage/create-data-domains';
import type { DataDomains } from '../src/main/storage/domain-files.type';
import { exportDomains } from '../src/main/storage/export-domains';
import { importDomains } from '../src/main/storage/import-domains';
import { readImportSource } from '../src/main/storage/read-import-source';
import { createZipWriter } from '../src/main/storage/zip/create-zip-writer';
import { openZipReader } from '../src/main/storage/zip/open-zip-reader';

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
    expect(imported).toEqual({ domains: ['sessions'], files: 2 });
    expect(await domains.domain('sessions').readJson('runs/one.json', null)).toEqual({ seed: 1 });
    expect(await domains.domain('sessions').exists('runs/extra.txt')).toBe(false);
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
