/* @layer renderer-shell @kind hook */
import { composeTitle } from './compose-title';
import { useDocumentTitleStore } from './useDocumentTitleStore';
import { useWindowTitleSync } from './useWindowTitleSync';

const useAppTitle = (base: string): string => {
  const document = useDocumentTitleStore((s) => s.document);
  useWindowTitleSync(base);
  return composeTitle(base, document);
};

export { useAppTitle };
