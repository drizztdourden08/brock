/* @layer core @kind logic */
import type { TrackerInput } from '../types/tracker-input.type';
import { placementIdentity } from './placement-identity';

const defaultWorldKey = (input: TrackerInput<unknown>): string =>
  `${placementIdentity(input.placement)}|${[...input.assumed].sort().join(',')}`;

export { defaultWorldKey };
