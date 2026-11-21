/* @layer core @kind types */
import type { RandomizerProfileConfig } from '../../augment';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { PendingBoot } from '../store/pending-boot.type';
import type { RandomizerSession } from './randomizer-session.type';

interface SessionFactory {
  mode: string;
  placementBacked: boolean;
  gate(profileId: string, config: RandomizerProfileConfig): Promise<PendingBoot | null>;
  create(pending: PendingBoot): RandomizerSession;
  allowsStart?(): boolean;
  blockedReason?(config: RandomizerProfileConfig): Text | null;
}

export type { SessionFactory };
