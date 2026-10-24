/* @layer electron-main @kind test */
import { vi } from 'vitest';

const electronDialogMock = {
  dialog: { showOpenDialog: vi.fn(), showSaveDialog: vi.fn(), showMessageBox: vi.fn() },
  app: { addRecentDocument: vi.fn(), clearRecentDocuments: vi.fn(), isPackaged: true },
};

export { electronDialogMock };
