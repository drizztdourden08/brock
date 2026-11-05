/* @layer renderer-shell @kind logic */
import { HOST_NAME } from './lobby-draft.constants';

const hostNameMessage = (host: unknown): string | undefined =>
  host === null || host === undefined || HOST_NAME.test(String(host)) ? undefined : 'Not a valid host name';

export { hostNameMessage };
