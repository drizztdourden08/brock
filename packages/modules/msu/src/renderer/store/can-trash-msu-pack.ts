/* @layer renderer-shell @kind logic */
import type { MsuStoreEnv } from './msu-store.type';

const canTrashMsuPack = ({ files }: MsuStoreEnv) => (): boolean => 'trash' in files;

export { canTrashMsuPack };
