/* @layer renderer-shell @kind component */
import type { ReactNode } from 'react';
import { Disclosure } from '@drizztdourden08/tessera/primitives';
import { SPOILER_SUMMARY } from '../GameInfoWidget.constants';

interface SpoilerProps {
  hidden: boolean;
  children: ReactNode;
}

const Spoiler = ({ hidden, children }: SpoilerProps) => {
  if (!hidden) return <>{children}</>;
  return <Disclosure summary={SPOILER_SUMMARY} size="sm">{children}</Disclosure>;
};

export { Spoiler };
