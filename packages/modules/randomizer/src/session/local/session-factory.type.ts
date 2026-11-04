/* @layer core @kind types */
import type { RandomizerProfileConfig } from '../../profile/randomizer-profile.type';
import type { PendingBoot } from '../store/pending-boot.type';
import type { RandomizerSession } from './randomizer-session.type';

interface SessionFactory {
  mode: string;
  placementBacked: boolean;
  gate(profileId: string, config: RandomizerProfileConfig): Promise<PendingBoot | null>;
  create(pending: PendingBoot): RandomizerSession;
  allowsStart?(): boolean;
}

export type { SessionFactory };
