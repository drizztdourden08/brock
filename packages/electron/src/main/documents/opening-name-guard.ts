/* @layer electron-main @kind logic */
import { basename } from 'path';
import { OPENING_SEGMENTS } from './opening-segments.constants';

const openingNameGuard = (target: string): void => {
  if (OPENING_SEGMENTS.has(basename(target).toLowerCase())) {
    throw new Error(`"${target}" is a name that opens a protected folder class and may not be changed`);
  }
};

export { openingNameGuard };
