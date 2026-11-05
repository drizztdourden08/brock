/* @layer renderer-shell @kind logic */
import { writeMsuResume as write } from '../../resume';
import type { MsuResumeState } from '../../types';
import type { MsuStoreEnv } from './msu-store.type';

const writeMsuResume = ({ game, files }: MsuStoreEnv) => (profile: string, kind: string, id: string | number, state: MsuResumeState) =>
  write({ config: game.config, files, slot: { profile, slotKind: kind, slotId: id }, state });

export { writeMsuResume };
