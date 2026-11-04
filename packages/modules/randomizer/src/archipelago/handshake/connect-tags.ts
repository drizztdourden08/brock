/* @layer core @kind logic */
import { DEATH_LINK_TAG } from './handshake.constants';

const connectTags = (deathLink: boolean | undefined): string[] => (deathLink ? [DEATH_LINK_TAG] : []);

export { connectTags };
