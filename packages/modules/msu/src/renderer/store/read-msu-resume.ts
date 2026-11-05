/* @layer renderer-shell @kind logic */
import { readMsuResume as read } from '../../resume';
import type { MsuStoreEnv } from './msu-store.type';

const readMsuResume = ({ game, files }: MsuStoreEnv) => (profile: string, kind: string, id: string | number) =>
  read(game.config, files, { profile, slotKind: kind, slotId: id });

export { readMsuResume };
