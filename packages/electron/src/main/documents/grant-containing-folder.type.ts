/* @layer electron-main @kind types */
import type { MainContext } from '../types/main-context.type';
import type { DocumentTracking } from './document-tracking.type';

type FolderGrantContext = Pick<MainContext, 'documents' | 'dialogs' | 'flags' | 'product' | 'log'>;

interface FolderGrantRequest {
  ctx: FolderGrantContext;
  tracking: Pick<DocumentTracking, 'picked'>;
  profileId: unknown;
}

interface FolderOutcome {
  folderGranted: boolean;
  folder?: string;
  reason?: string;
}

export type { FolderGrantContext, FolderGrantRequest, FolderOutcome };
