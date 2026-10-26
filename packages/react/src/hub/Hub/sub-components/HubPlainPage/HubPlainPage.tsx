/* @layer renderer-shell @kind component */
import { Box, ScrollArea } from '@drizztdourden08/tessera/primitives';
import type { HubPlainPageProps } from './HubPlainPage.type';

const HubPlainPage = (props: HubPlainPageProps) => {
  const { label, scroll, children } = props;
  return (
    <Box as="section" className="screen-page page-card" aria-label={label}>
      {scroll
        ? <ScrollArea className="screen-page__body hub__plain-body">{children}</ScrollArea>
        : <Box className="screen-page__body screen-page__body--fixed">{children}</Box>}
    </Box>
  );
};

export { HubPlainPage };
