/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Status } from '@drizztdourden08/tessera/primitives';
import type { CheckBadgesProps } from './CheckBadges.type';

const CheckBadges = ({ badges }: CheckBadgesProps) => {
  const text = useText();
  return (
    <>
      {badges.map((badge) => (
        <Status key={badge.id} tone={badge.tone} variant="pill" title={badge.title === undefined ? undefined : text(badge.title)}>
          {text(badge.label)}
        </Status>
      ))}
    </>
  );
};

export { CheckBadges };
