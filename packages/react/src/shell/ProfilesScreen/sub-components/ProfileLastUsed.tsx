/* @layer renderer-shell @kind component */
import { REVIEW_MASK } from '@drizztdourden08/brock-core/review';
import { DateText } from '@drizztdourden08/tessera/composites';
import { Span } from '@drizztdourden08/tessera/primitives';
import { NEVER_USED_TEXT } from '../ProfilesScreen.constants';
import type { ProfileLastUsedProps } from './ProfileLastUsed.type';

const ProfileLastUsed = (props: ProfileLastUsedProps) => {
  const { at } = props;
  return <Span {...REVIEW_MASK}>{at ? <DateText value={at} format="relative" /> : NEVER_USED_TEXT}</Span>;
};

export { ProfileLastUsed };
