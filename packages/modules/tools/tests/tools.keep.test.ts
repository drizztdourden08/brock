/* @layer electron-main @kind test */
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'fs';
import { createServer } from 'http';
import type { Server } from 'http';
import type { AddressInfo } from 'net';
import { tmpdir } from 'os';
import { basename, dirname, join } from 'path';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import type { JobHandle, StartJob } from '@drizztdourden08/brock-electron/main';
import { createZipWriter } from '@drizztdourden08/brock-electron/zip';
import { createTools } from '../src/main/create-tools';
import { defineTool } from '../src/main/define-tool';
import { locateTool } from '../src/main/locate-tool';
import { systemTar } from '../src/main/system-tar';
import { toolPlatform } from '../src/main/tool-platform';
import type { ToolsEnv } from '../src/main/tools-main.type';

const SHA = 'a'.repeat(64);
const dirs: string[] = [];
const scratchDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-tools-'));
  dirs.push(dir);
  return dir;
};

const files = new Map<string, Buffer>();
let hits = 0;
let server: Server;
let origin = '';

beforeAll(async () => {
  server = createServer((req, res) => {
    hits += 1;
    const body = files.get(req.url ?? '');
    if (!body) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-length': String(body.length) }).end(body);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => new Promise<void>((resolve) => { server.close(() => resolve()); }));

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  files.clear();
  hits = 0;
});

const sha256 = (data: Buffer): string => createHash('sha256').update(data).digest('hex');

const zipOf = async (entries: Record<string, string>): Promise<Buffer> => {
  const file = join(scratchDir(), 'pack.zip');
  const zip = await createZipWriter(file);
  for (const [name, text] of Object.entries(entries)) await zip.add(name, Buffer.from(text));
  await zip.close();
  return readFileSync(file);
};

const fakeJobs = (): { start: StartJob; steps: string[] } => {
  const steps: string[] = [];
  const handle = (id: string): JobHandle => {
    const job: JobHandle = {
      id, signal: new AbortController().signal,
      step: (step) => { steps.push(step); }, progress: () => undefined, line: () => undefined, log: () => undefined,
      skip: () => undefined, done: () => { steps.push('done'); }, fail: () => { steps.push('failed'); },
      run: async (work) => {
        try {
          const value = await work(job);
          job.done();
          return value;
        } catch (err) {
          job.fail(err);
          throw err;
        }
      },
    };
    return job;
  };
  return { start: (id) => handle(id), steps };
};

const envOf = (jobs: StartJob, pathEnv = ''): ToolsEnv => ({
  cacheRoot: scratchDir(), tempDir: scratchDir(), platform: 'win32-x64', os: 'win32', pathEnv, fetch: (url, init) => fetch(url, init), job: jobs,
});

const ffmpegAt = (url: string, sha256Hex: string, archive: 'zip' | 'tar' = 'zip') => ({
  id: 'ffmpeg', label: 'FFmpeg', binaries: ['ffmpeg', 'ffprobe'], usePath: false,
  downloads: { 'win32-x64': { url, sha256: sha256Hex, archive } },
});

describe('defineTool', () => {
  it('fills the defaults and refuses a bad id, binary name, checksum or URL', () => {
    expect(defineTool({ id: 'ffmpeg', label: 'FFmpeg', binaries: ['ffmpeg'] })).toMatchObject({ usePath: true, version: 'current' });
    expect(() => defineTool({ id: 'FFmpeg Tool', label: 'x', binaries: ['a'] })).toThrow(/slug/);
    expect(() => defineTool({ id: 'x', label: 'x', binaries: ['bin/ffmpeg.exe'] })).toThrow(/bare file name/);
    expect(() => defineTool({ id: 'x', label: 'x', binaries: [] })).toThrow(/no binary/);
    expect(() => defineTool({ id: 'x', label: 'x', binaries: ['a'], downloads: { 'linux-x64': { url: 'https://e/a', sha256: 'abc' } } })).toThrow(/sha256/);
    expect(() => defineTool({ id: 'x', label: 'x', binaries: ['a'], downloads: { 'linux-x64': { url: 'file:///a', sha256: SHA } } })).toThrow(/http/);
  });

  it('names the platform key, or none for an unknown system', () => {
    expect(toolPlatform('win32', 'x64')).toBe('win32-x64');
    expect(toolPlatform('freebsd', 'x64')).toBeNull();
  });
});

describe('locateTool', () => {
  it('prefers the cached copy, then a PATH folder that holds every binary', async () => {
    const cache = scratchDir();
    const partial = scratchDir();
    const full = scratchDir();
    writeFileSync(join(partial, 'ffmpeg.exe'), '');
    writeFileSync(join(full, 'ffmpeg.exe'), '');
    writeFileSync(join(full, 'ffprobe.exe'), '');
    const def = defineTool({ id: 'ffmpeg', label: 'FFmpeg', binaries: ['ffmpeg', 'ffprobe'] });
    const pathEnv = [partial, full].join(process.platform === 'win32' ? ';' : ':');
    expect(await locateTool(def, { cacheDir: cache, platform: 'win32', pathEnv })).toEqual({
      source: 'path', paths: { ffmpeg: join(full, 'ffmpeg.exe'), ffprobe: join(full, 'ffprobe.exe') },
    });
    expect(await locateTool({ ...def, usePath: false }, { cacheDir: cache, platform: 'win32', pathEnv })).toBeNull();
    writeFileSync(join(cache, 'ffmpeg.exe'), '');
    writeFileSync(join(cache, 'ffprobe.exe'), '');
    expect((await locateTool(def, { cacheDir: cache, platform: 'win32', pathEnv }))?.source).toBe('cache');
  });
});

describe('createTools install', () => {
  it('downloads, verifies and unpacks the binaries from a zip as one job', async () => {
    const zip = await zipOf({ 'ffmpeg-9/bin/ffmpeg.exe': 'encoder', 'ffmpeg-9/bin/ffprobe.exe': 'prober', 'ffmpeg-9/README.txt': 'x' });
    files.set('/ffmpeg.zip', zip);
    const jobs = fakeJobs();
    const tools = createTools(envOf(jobs.start));
    tools.register(ffmpegAt(`${origin}/ffmpeg.zip`, sha256(zip)));
    expect((await tools.state('ffmpeg'))?.status).toBe('missing');

    const [first, second] = await Promise.all([tools.install('ffmpeg'), tools.install('ffmpeg')]);
    expect(first).toEqual(second);
    expect(hits).toBe(1);
    if (!first.success) throw new Error(first.error);
    expect(first.value).toMatchObject({ status: 'ready', source: 'cache' });
    expect(readFileSync(first.value.paths?.ffprobe ?? '', 'utf8')).toBe('prober');
    expect(jobs.steps).toEqual(['download', 'verify', 'extract', 'done']);
  });

  it('refuses a download whose checksum does not match and keeps nothing', async () => {
    files.set('/ffmpeg.zip', await zipOf({ 'ffmpeg.exe': 'a', 'ffprobe.exe': 'b' }));
    const jobs = fakeJobs();
    const env = envOf(jobs.start);
    const tools = createTools(env);
    tools.register(ffmpegAt(`${origin}/ffmpeg.zip`, SHA));
    const result = await tools.install('ffmpeg');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/sha256/);
    expect(jobs.steps).toEqual(['download', 'verify', 'failed']);
    expect(existsSync(join(env.cacheRoot, 'ffmpeg'))).toBe(false);
    expect((await tools.state('ffmpeg'))?.status).toBe('missing');
  });

  it('unpacks a tar archive with the system tar', async () => {
    const src = scratchDir();
    mkdirSync(join(src, 'bin'));
    writeFileSync(join(src, 'bin', 'ffmpeg.exe'), 'e');
    writeFileSync(join(src, 'bin', 'ffprobe.exe'), 'p');
    const tarFile = join(scratchDir(), 'ffmpeg.tar');
    execFileSync(systemTar(), ['-cf', tarFile, '-C', src, 'bin']);
    const tar = readFileSync(tarFile);
    files.set('/ffmpeg.tar', tar);
    const tools = createTools(envOf(fakeJobs().start));
    tools.register(ffmpegAt(`${origin}/ffmpeg.tar`, sha256(tar), 'tar'));
    const result = await tools.install('ffmpeg');
    expect(result.success && basename(dirname(result.value.paths?.ffmpeg ?? ''))).toBe('current');
  });

  it('reports a tool with no download for this system as unavailable, with the hint', async () => {
    const tools = createTools({ ...envOf(fakeJobs().start), platform: 'linux-x64' });
    tools.register({ ...ffmpegAt(`${origin}/x`, SHA), installHint: 'Install the ffmpeg package.' });
    expect(await tools.state('ffmpeg')).toMatchObject({ status: 'unavailable', canInstall: false, hint: 'Install the ffmpeg package.' });
    expect(await tools.install('ffmpeg')).toEqual({ success: false, error: 'Install the ffmpeg package.' });
  });
});

describe('createTools run', () => {
  const nodeTool = () => {
    const tools = createTools({ ...envOf(fakeJobs().start, dirname(process.execPath)), platform: toolPlatform(), os: process.platform });
    tools.register({ id: 'node', label: 'Node', binaries: [basename(process.execPath).replace(/\.exe$/i, '')] });
    return { tools, binary: basename(process.execPath).replace(/\.exe$/i, '') };
  };

  it('runs a binary found on PATH with an argument array and reports each line', async () => {
    const { tools, binary } = nodeTool();
    const lines: string[] = [];
    const result = await tools.run('node', binary, ['-e', 'console.log("a b\\nc"); console.error("warn")'], { onLine: (line, stream) => lines.push(`${stream}:${line}`) });
    expect(result).toMatchObject({ code: 0, timedOut: false });
    expect(lines).toEqual(expect.arrayContaining(['stdout:a b', 'stdout:c', 'stderr:warn']));
  });

  it('stops a run that takes longer than its timeout', async () => {
    const { tools, binary } = nodeTool();
    const result = await tools.run('node', binary, ['-e', 'setTimeout(() => {}, 10000)'], { timeoutMs: 200 });
    expect(result.timedOut).toBe(true);
  });

  it('refuses a binary the tool does not declare', async () => {
    const { tools } = nodeTool();
    await expect(tools.run('node', 'npm', [])).rejects.toThrow(/no npm/);
    await expect(tools.run('missing', 'x', [])).rejects.toThrow(/no tool "missing"/);
  });
});
