/* @layer electron-main @kind logic */
import { net } from 'electron';
import type { NetHop, NetTransport } from './net-transport.type';
import { chunksOf } from './response-chunks';

const headerOf = (headers: Record<string, string | string[]>, name: string): string | null => {
  const value = headers[name];
  return (Array.isArray(value) ? value[0] : value) ?? null;
};

const lengthOf = (value: string | null): number | null => {
  const length = value === null ? Number.NaN : Number(value);
  return Number.isFinite(length) && length >= 0 ? length : null;
};

const encodedBy = (encoding: string | null): boolean => encoding !== null && encoding.trim().toLowerCase() !== 'identity';

const electronNetTransport: NetTransport = (url, signal) =>
  new Promise<NetHop>((resolve, reject) => {
    const request = net.request({ url, method: 'GET', redirect: 'manual', credentials: 'omit' });
    const stop = (): void => request.abort();
    signal.addEventListener('abort', stop, { once: true });
    request.on('abort', () => reject(new Error('net.read was cancelled or timed out')));
    request.on('error', reject);
    request.on('redirect', (status, _method, location) => {
      resolve({ status, contentType: null, contentLength: null, encoded: false, location, body: null, close: () => undefined });
      request.abort();
    });
    request.on('response', (response) => {
      const headers = response.headers;
      resolve({
        status: response.statusCode,
        contentType: headerOf(headers, 'content-type'),
        contentLength: lengthOf(headerOf(headers, 'content-length')),
        encoded: encodedBy(headerOf(headers, 'content-encoding')),
        location: headerOf(headers, 'location'),
        body: chunksOf(response),
        close: () => {
          signal.removeEventListener('abort', stop);
          request.abort();
        },
      });
    });
    request.end();
  });

export { electronNetTransport };
