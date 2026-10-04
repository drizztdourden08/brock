/* @layer renderer-shell @kind component */
import { useContext, useLayoutEffect } from 'react';
import { HeaderActions } from '../HeaderActions';
import { PageActionsContext } from '../page-actions-context';
import type { PageActionsProps } from './PageActions.type';

const PageActions = (props: PageActionsProps) => {
  const { search, primary, children } = props;
  const put = useContext(PageActionsContext);
  const node = <HeaderActions search={search} primary={primary}>{children}</HeaderActions>;
  useLayoutEffect(() => {
    put(node);
  });
  useLayoutEffect(() => () => put(null), [put]);
  return null;
};

export { PageActions };
