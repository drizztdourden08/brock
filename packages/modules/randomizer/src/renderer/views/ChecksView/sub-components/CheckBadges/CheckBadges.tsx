/* @layer renderer-shell @kind component */
import { Status } from '@drizztdourden08/tessera/primitives';
import type { CheckBadgesProps } from './CheckBadges.type';

const CheckBadges = ({ badges }: CheckBadgesProps) => (
  <>
    {badges.map((badge) => (
      <Status key={badge.id} tone={badge.tone} variant="pill" title={badge.title}>{badge.label}</Status>
    ))}
  </>
);

export { CheckBadges };
