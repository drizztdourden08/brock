/* @layer electron-main @kind logic */
import { WINDOWS_DEVICE_NAME, WINDOWS_RAW_PREFIX, WINDOWS_TRAILING } from './folder-grants.constants';

const unusable = (segment: string): boolean => WINDOWS_DEVICE_NAME.test(segment) || (segment !== '.' && WINDOWS_TRAILING.test(segment));

const unsafeSegments = (path: string): boolean => {
  const segments = path.split(/[\\/]/);
  if (segments.includes('..')) return true;
  if (process.platform !== 'win32') return false;
  return WINDOWS_RAW_PREFIX.test(path) || path.slice(2).includes(':') || segments.some(unusable);
};

export { unsafeSegments };
