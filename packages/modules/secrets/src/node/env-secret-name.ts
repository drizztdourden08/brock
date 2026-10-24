/* @layer core @kind logic */
import { ENV_PREFIX } from './node-secret-store.constants';

const envSecretName = (name: string, prefix: string = ENV_PREFIX): string =>
  `${prefix}${name.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;

export { envSecretName };
