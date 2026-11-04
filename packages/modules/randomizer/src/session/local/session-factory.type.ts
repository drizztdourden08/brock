/* @layer core @kind types */
import type { RandomizerProfileConfig } from '../../augment';
import type { PendingBoot } from '../store/pending-boot.type';
import type { RandomizerSession } from './randomizer-session.type';

interface SessionFactory {
  mode: string;
  placementBacked: boolean;
  gate(profileId: string, config: RandomizerProfileConfig): Promise<PendingBoot | null>;
  create(pending: PendingBoot): RandomizerSession;
  allowsStart?(): boolean;
  blockedReason?(config: RandomizerProfileConfig): string | null;
}

export type { SessionFactory };
