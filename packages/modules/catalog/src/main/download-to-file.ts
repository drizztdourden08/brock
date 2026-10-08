/* @layer electron-main @kind logic */
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import type { Downloaded, DownloadOptions } from './download-to-file.type';

const writeChunk = async (out: ReturnType<typeof createWriteStream>, chunk: Uint8Array): Promise<void> => {
  if (!out.write(chunk)) await once(out, 'drain');
};

const pump = async (body: ReadableStream<Uint8Array>, out: ReturnType<typeof createWriteStream>, onChunk: (chunk: Uint8Array) => void): Promise<void> => {
  const reader = body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(value);
    await writeChunk(out, value);
  }
};

const downloadToFile = async (url: string, options: DownloadOptions): Promise<Downloaded> => {
  const dir = await mkdtemp(join(tmpdir(), 'brock-catalog-'));
  const dispose = () => rm(dir, { recursive: true, force: true });
  const file = join(dir, 'download');
  const hash = createHash('sha256');
  let bytes = 0;
  try {
    const response = await (options.fetch ?? fetch)(url, { signal: options.signal });
    if (!response.ok || !response.body) throw new Error(`The download answered ${response.status}.`);
    const out = createWriteStream(file);
    await pump(response.body, out, (chunk) => {
      hash.update(chunk);
      bytes += chunk.byteLength;
      options.onProgress(bytes);
    });
    out.end();
    await once(out, 'close');
    return { file, bytes, sha256: hash.digest('hex'), dispose };
  } catch (error) {
    await dispose();
    throw error;
  }
};

export { downloadToFile };
