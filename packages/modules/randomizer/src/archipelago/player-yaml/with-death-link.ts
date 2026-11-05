/* @layer core @kind logic */
import { DEATH_LINK_KEY } from './player-yaml.constants';

const withDeathLink = (values: Readonly<Record<string, unknown>>, deathLink?: boolean): Record<string, unknown> =>
  deathLink === undefined ? { ...values } : { ...values, [DEATH_LINK_KEY]: deathLink };

export { withDeathLink };
