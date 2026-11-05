/* @layer renderer-shell @kind logic */
import type { FetchProgress } from './msu-store.type';

const defaultFetchBytes = async (url: string, onProgress?: FetchProgress): Promise<Uint8Array> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed (${response.status})`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  onProgress?.(bytes.length, bytes.length);
  return bytes;
};

export { defaultFetchBytes };
