/* @layer core @kind constants */
const LOBBY_SDK = { name: '@drizztdourden08/archipelia-lobby-protocol', version: '1.1.0' };
const DEFAULT_CAPABILITIES = ['slots.yaml', 'worlds.upload'];

const INFO_TIMEOUT_MS = 15000;
const MAX_RECONNECTS = 5;
const HASH_MISMATCH_RETRIES = 1;
const BASE64_SLICE = 0x8000;

export {
  BASE64_SLICE,
  DEFAULT_CAPABILITIES,
  HASH_MISMATCH_RETRIES,
  INFO_TIMEOUT_MS,
  LOBBY_SDK,
  MAX_RECONNECTS,
};
