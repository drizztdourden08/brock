/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import type { UpdateNotice, UpdateNoticeContext } from './update-notice.type';

const isEmpty = (node: ReactNode): boolean => node === null || node === undefined || node === false || node === '';

const resolveUpdateNotice = (notice: UpdateNotice | null, context: UpdateNoticeContext | null): ReactNode => {
  if (!notice || !context) return null;
  const node = typeof notice === 'function' ? notice(context) : notice[context.version];
  return isEmpty(node) ? null : node;
};

export { resolveUpdateNotice };
