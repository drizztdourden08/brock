/* @layer renderer-shell @kind constants */
import type { ArchipelagoConnection } from '../../../augment';
import type { RoomMessage } from '../../../archipelago';

const NO_MESSAGES: readonly RoomMessage[] = [];
const NO_SLOT_NAME_REASON = 'Enter a valid slot name.';
const NO_PROFILE_REASON = 'No profile is selected.';
const NO_CONNECTION: ArchipelagoConnection = {};

export { NO_MESSAGES, NO_SLOT_NAME_REASON, NO_PROFILE_REASON, NO_CONNECTION };
