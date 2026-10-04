/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { SearchAnchorProps } from './SearchAnchor.type';

const SearchAnchor = (props: SearchAnchorProps) => {
  const { anchor, className, children } = props;
  return <Box className={className} data-search-anchor={anchor}>{children}</Box>;
};

export { SearchAnchor };
