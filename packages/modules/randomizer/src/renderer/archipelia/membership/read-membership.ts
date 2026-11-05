/* @layer renderer-shell @kind logic */
import { readConfig } from '@drizztdourden08/brock-react';
import { MEMBERSHIP_KEY } from './membership.constants';
import type { ArchipeliaMembership } from './membership.type';
import { queueConfig } from './queue-config';

const isMembership = (value: unknown): value is ArchipeliaMembership =>
  typeof value === 'object' && value !== null && 'state' in value && 'server' in value && 'lobby' in value;

const readMembership = async (profileId: string): Promise<ArchipeliaMembership | null> => {
  const stored = (await queueConfig(profileId, () => readConfig(profileId)))?.[MEMBERSHIP_KEY];
  return isMembership(stored) ? stored : null;
};

export { readMembership };
