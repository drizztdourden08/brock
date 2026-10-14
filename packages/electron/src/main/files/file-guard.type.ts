/* @layer electron-main @kind types */
import type { MainContext } from '../types/main-context.type';

type FileWriteKind = 'writeBytes' | 'writeText' | 'remove' | 'mkdir' | 'trash';

interface FileWriteRequest {
  kind: FileWriteKind;
  path: string;
}

type FileGuardVerdict = boolean | string | undefined;

type FileWriteGuard = (request: FileWriteRequest, ctx: MainContext) => FileGuardVerdict | Promise<FileGuardVerdict>;

export type { FileGuardVerdict, FileWriteGuard, FileWriteKind, FileWriteRequest };
