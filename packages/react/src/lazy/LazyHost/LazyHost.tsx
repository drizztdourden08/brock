/* @layer renderer-shell @kind component */
import { Suspense } from 'react';
import { LazyFallback } from './sub-components/LazyFallback';
import type { LazyHostProps } from './LazyHost.type';
import './LazyHost.css';

const LazyHost = (props: LazyHostProps) => {
  const { children } = props;
  return <Suspense fallback={<LazyFallback />}>{children}</Suspense>;
};

export { LazyHost };
