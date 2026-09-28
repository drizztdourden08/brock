/* @layer core @kind constants */
import type { OsKind } from './platform.type';

const OS_BY_PLATFORM = new Map<string, OsKind>([
  ['win32', 'windows'],
  ['darwin', 'macos'],
  ['linux', 'linux'],
]);

export { OS_BY_PLATFORM };
