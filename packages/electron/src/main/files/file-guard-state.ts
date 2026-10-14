/* @layer electron-main @kind logic */
import type { FileWriteGuard } from './file-guard.type';

const fileGuard: { current: FileWriteGuard | null } = { current: null };

export { fileGuard };
