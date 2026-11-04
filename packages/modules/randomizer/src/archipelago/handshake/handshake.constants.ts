/* @layer core @kind constants */
import type { ApVersion } from '../protocol/protocol.type';

const FALLBACK_VERSION: ApVersion = { major: 0, minor: 6, build: 6, class: 'Version' };
const ITEMS_HANDLING_ALL = 0b111;
const DEATH_LINK_TAG = 'DeathLink';

export { DEATH_LINK_TAG, FALLBACK_VERSION, ITEMS_HANDLING_ALL };
