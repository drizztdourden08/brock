/* @layer core @kind constants */
import { LEGACY_STORAGE_PREFIX, STORAGE_PREFIX } from '../storage/storage.constants';

const UUID_KEY = `${STORAGE_PREFIX}uuid`;
const LEGACY_UUID_KEY = `${LEGACY_STORAGE_PREFIX}uuid`;

export { LEGACY_UUID_KEY, UUID_KEY };
