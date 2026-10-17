/* @layer renderer-shell @kind logic */
import { groupKey } from '../../settings/group-key';
import type { ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const doubledLabels = (labels: readonly string[]): string[] => {
  const seen = new Set<string>();
  const doubled = new Set<string>();
  for (const label of labels.filter((candidate) => candidate.trim() !== '')) {
    const key = groupKey(label);
    if (seen.has(key)) doubled.add(label);
    seen.add(key);
  }
  return [...doubled];
};

const navGroupChecks = (hub: string, labels: readonly string[]): ReviewOutcome[] => {
  const doubled = doubledLabels(labels);
  return [outcome(
    `${hub}-nav-groups`,
    doubled.length === 0,
    `the "${hub}" nav has no two groups with the same label`,
    `the "${hub}" nav shows more than one group named ${doubled.map((label) => `"${label}"`).join(', ')}`,
  )];
};

export { navGroupChecks };
