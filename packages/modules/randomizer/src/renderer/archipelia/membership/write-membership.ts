/* @layer renderer-shell @kind logic */
import { readConfig, writeConfig } from '@drizztdourden08/brock-react';
import { MEMBERSHIP_KEY } from './membership.constants';
import type { ArchipeliaMembership } from './membership.type';
import { queueConfig } from './queue-config';

const withMembership = (config: Record<string, unknown>, membership: ArchipeliaMembership | null): Record<string, unknown> => {
  const { [MEMBERSHIP_KEY]: _old, ...rest } = config;
  return membership === null ? rest : { ...rest, [MEMBERSHIP_KEY]: membership };
};

const writeMembership = (profileId: string, membership: ArchipeliaMembership | null): Promise<void> =>
  queueConfig(profileId, async () => {
    await writeConfig(profileId, withMembership((await readConfig(profileId)) ?? {}, membership));
  });

export { writeMembership };
