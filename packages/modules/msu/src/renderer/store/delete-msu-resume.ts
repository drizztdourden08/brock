/* @layer renderer-shell @kind logic */
import { deleteMsuResume as remove } from '../../resume';
import type { MsuStoreEnv } from './msu-store.type';

const deleteMsuResume = ({ game, files }: MsuStoreEnv) => (profile: string, kind: string, id: string | number) =>
  remove(game.config, files, { profile, slotKind: kind, slotId: id });

export { deleteMsuResume };
