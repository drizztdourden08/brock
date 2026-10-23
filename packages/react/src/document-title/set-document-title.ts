/* @layer renderer-shell @kind logic */
import type { DocumentTitle } from './document-title.type';
import { useDocumentTitleStore } from './useDocumentTitleStore';

const setDocumentTitle = (document: DocumentTitle | null): void => useDocumentTitleStore.getState().set(document);

export { setDocumentTitle };
