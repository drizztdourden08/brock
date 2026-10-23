/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { OsRecent } from './recent-documents.type';

const osRecent: OsRecent = {
  add: (path) => app.addRecentDocument(path),
  clear: () => app.clearRecentDocuments(),
};

export { osRecent };
