/* @layer renderer-shell @kind component */
import { REVIEW_MASK } from '@drizztdourden08/brock-core/review';
import { DateText } from '@drizztdourden08/tessera/composites';
import { Span } from '@drizztdourden08/tessera/primitives';
import { useT } from '../../../i18n';
import type { ProfileLastUsedProps } from './ProfileLastUsed.type';

const ProfileLastUsed = (props: ProfileLastUsedProps) => {
  const { at } = props;
  const t = useT();
  return <Span {...REVIEW_MASK}>{at ? <DateText value={at} format="relative" /> : t('brock-shell:profiles.never')}</Span>;
};

export { ProfileLastUsed };
