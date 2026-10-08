/* @layer electron-main @kind logic */
import type { CatalogGrant } from '../catalog.type';
import { GRANT_UNREADABLE, SHA256_HEX } from './verify-grant.constants';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const textOf = (value: Record<string, unknown>, key: string): string => {
  const field = value[key];
  if (typeof field !== 'string' || !field) throw new Error(GRANT_UNREADABLE);
  return field;
};

const wholeOf = (value: Record<string, unknown>, key: string): number => {
  const field = value[key];
  if (typeof field !== 'number' || !Number.isInteger(field)) throw new Error(GRANT_UNREADABLE);
  return field;
};

const parseGrant = (value: unknown): CatalogGrant => {
  if (!isRecord(value)) throw new Error(GRANT_UNREADABLE);
  const sha256 = textOf(value, 'sha256');
  if (!SHA256_HEX.test(sha256)) throw new Error(GRANT_UNREADABLE);
  return {
    itemId: textOf(value, 'itemId'),
    label: textOf(value, 'label'),
    url: textOf(value, 'url'),
    container: textOf(value, 'container'),
    sha256,
    version: wholeOf(value, 'version'),
    bytes: wholeOf(value, 'bytes'),
    kind: typeof value.kind === 'string' ? value.kind : null,
    meta: isRecord(value.meta) ? value.meta : {},
  };
};

export { parseGrant };
