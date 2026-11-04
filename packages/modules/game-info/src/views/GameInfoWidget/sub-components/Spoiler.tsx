/* @layer renderer-shell @kind component */
import { Disclosure } from '@drizztdourden08/tessera/primitives';
import { SPOILER_SUMMARY } from '../GameInfoWidget.constants';
import type { SpoilerProps } from './Spoiler.type';

const Spoiler = ({ hidden, children }: SpoilerProps) => {
  if (!hidden) return <>{children}</>;
  return <Disclosure summary={SPOILER_SUMMARY} size="sm">{children}</Disclosure>;
};

export { Spoiler };
