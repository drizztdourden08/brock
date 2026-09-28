/* @layer core @kind logic */
import type { OsKind } from './platform.type';
import { OS_BY_PLATFORM } from './os-from-process.constants';

const osFromProcess = (platform: string | undefined): OsKind => OS_BY_PLATFORM.get(platform ?? '') ?? 'unknown';

export { osFromProcess };
