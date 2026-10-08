/* @layer electron-main @kind logic */
import type { CatalogGrant } from '../catalog.type';
import { DOWNLOAD_MISMATCH } from './verify-grant.constants';

const verifyDownload = (grant: CatalogGrant, received: { bytes: number; sha256: string }): void => {
  if (received.bytes !== grant.bytes || received.sha256.toLowerCase() !== grant.sha256.toLowerCase()) throw new Error(DOWNLOAD_MISMATCH);
};

export { verifyDownload };
