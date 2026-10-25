/* @layer renderer-shell @kind constants */
import type { Politeness } from './announce.type';

const DEFAULT_POLITENESS: Politeness = 'polite';

const ANNOUNCE_SET_DELAY_MS = 50;

const ANNOUNCE_CLEAR_MS = 6000;

const ANNOUNCER_CLASS = 'brock-announcer';

export { ANNOUNCE_CLEAR_MS, ANNOUNCE_SET_DELAY_MS, ANNOUNCER_CLASS, DEFAULT_POLITENESS };
