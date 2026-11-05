/* @layer renderer-shell @kind logic */
import { DEFAULT_PACK_FILE_NAME } from './msu-store.constants';

const lastPathSegment = (url: string): string => {
  try {
    return new URL(url).pathname.split('/').pop() ?? '';
  } catch {
    return '';
  }
};

const nameFromUrl = (url: string): string => lastPathSegment(url) || DEFAULT_PACK_FILE_NAME;

export { nameFromUrl };
