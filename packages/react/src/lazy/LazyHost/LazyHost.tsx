/* @layer renderer-shell @kind component */
import { Suspense } from 'react';
import { Box, Spinner } from '@drizztdourden08/tessera/primitives';
import type { LazyHostProps } from './LazyHost.type';
import './LazyHost.css';

const LazyHost = (props: LazyHostProps) => {
  const { children } = props;
  const fallback = (
    <Box className="lazy-host" data-brock-loading="">
      <Spinner size="md" />
    </Box>
  );
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export { LazyHost };
