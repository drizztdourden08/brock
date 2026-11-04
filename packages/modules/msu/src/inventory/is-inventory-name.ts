/* @layer core @kind logic */
import { MSUL_MANIFEST_NAME } from '../manifest-io';

const isInventoryName = (name: string): boolean => name !== MSUL_MANIFEST_NAME;

export { isInventoryName };
