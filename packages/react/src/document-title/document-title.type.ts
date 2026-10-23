/* @layer renderer-shell @kind types */
interface DocumentTitle {
  name: string;
  dirty: boolean;
}

interface DocumentTitleState {
  document: DocumentTitle | null;
  set: (document: DocumentTitle | null) => void;
}

export type { DocumentTitle, DocumentTitleState };
