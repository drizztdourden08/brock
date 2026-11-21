/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { FetchBytes, FetchProgress, StoreText } from './msu-store.type';

const defaultFetchBytes = (text: StoreText): FetchBytes => async (url: string, onProgress?: FetchProgress): Promise<Uint8Array> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(text(msg('msu:store.downloadStatus', { status: response.status })));
  const bytes = new Uint8Array(await response.arrayBuffer());
  onProgress?.(bytes.length, bytes.length);
  return bytes;
};

export { defaultFetchBytes };
