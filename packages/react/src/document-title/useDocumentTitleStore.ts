/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { DocumentTitleState } from './document-title.type';

const useDocumentTitleStore = create<DocumentTitleState>()((set) => ({
  document: null,
  set: (document) => set({ document }),
}));

export { useDocumentTitleStore };
