/* @layer renderer-shell @kind constants */
import type { ConnectionForm } from './connection-form.type';

const CONNECTION_STEP_ID = 'randomizer-connection';
const CONNECTION_SLICE = 'randomizerConnection';
const DEFAULT_PORT = '38281';
const NO_SLOT_NAME = 'Enter a slot name.';

const initialConnection = (): ConnectionForm => ({ host: '', port: DEFAULT_PORT, slotName: '', password: '', deathLink: false });

export { CONNECTION_STEP_ID, CONNECTION_SLICE, NO_SLOT_NAME, initialConnection };
