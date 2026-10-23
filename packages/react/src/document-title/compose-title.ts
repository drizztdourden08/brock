/* @layer renderer-shell @kind logic */
import { DIRTY_MARK, TITLE_SEPARATOR } from './document-title.constants';
import type { DocumentTitle } from './document-title.type';

const composeTitle = (base: string, document: DocumentTitle | null): string => {
  const name = document?.name.trim() ?? '';
  if (document === null || name === '') return base;
  return `${name}${document.dirty ? DIRTY_MARK : ''}${TITLE_SEPARATOR}${base}`;
};

export { composeTitle };
