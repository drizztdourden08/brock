/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { DocumentTitle } from './document-title.type';
import { setDocumentTitle } from './set-document-title';

const useDocumentTitle = (document: DocumentTitle | null): void => {
  const name = document?.name ?? null;
  const dirty = document?.dirty ?? false;
  useEffect(() => {
    setDocumentTitle(name === null ? null : { name, dirty });
    return () => setDocumentTitle(null);
  }, [name, dirty]);
};

export { useDocumentTitle };
