/* @layer electron-main @kind logic */
import { createWriteStream } from 'fs';
import { rm } from 'fs/promises';
import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';
import type { ReadableStream as WebStream } from 'stream/web';
import type { DownloadOptions } from './tools-main.type';
import { DOWNLOAD_PROTOCOLS } from './tools-main.constants';

const counter = (total: number | null, onProgress: DownloadOptions['onProgress']): Transform => {
  let received = 0;
  return new Transform({
    transform: (chunk: Buffer, _encoding, done) => {
      received += chunk.length;
      onProgress?.(received, total);
      done(null, chunk);
    },
  });
};

const downloadFile = async (url: string, target: string, { fetch, signal, onProgress }: DownloadOptions): Promise<void> => {
  if (!DOWNLOAD_PROTOCOLS.includes(new URL(url).protocol)) throw new Error(`refusing to download ${url}: only http and https`);
  const response = await fetch(url, { signal });
  if (!response.ok || !response.body) throw new Error(`download of ${url} failed with HTTP ${response.status}`);
  const length = Number(response.headers.get('content-length'));
  const total = Number.isFinite(length) && length > 0 ? length : null;
  try {
    await pipeline(Readable.fromWeb(response.body as WebStream<Uint8Array>), counter(total, onProgress), createWriteStream(target), { signal });
  } catch (err) {
    await rm(target, { force: true });
    throw err;
  }
};

export { downloadFile };
