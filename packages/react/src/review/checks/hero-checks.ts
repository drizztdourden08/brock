/* @layer renderer-shell @kind logic */
import type { HeroSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const heroChecks = (snapshot: HeroSnapshot): ReviewOutcome[] => {
  const { hub, rendered, title, slots } = snapshot;
  if (!rendered) return [outcome(`${hub}-hero-renders`, false, '', `the "${hub}" home did not render the Hero composite`)];
  return [
    outcome(`${hub}-hero-renders`, true, `the "${hub}" home renders the Hero composite`, ''),
    outcome(`${hub}-hero-title`, title !== '', `the hero title reads "${title}"`, 'the hero title is empty'),
    outcome(`${hub}-hero-slots`, slots.length > 0, `the hero fills ${slots.join(', ')}`, 'the hero fills no slot besides the title'),
  ];
};

export { heroChecks };
