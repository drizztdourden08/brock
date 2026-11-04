/* @layer renderer-shell @kind logic */
import type { ConnectionForm, ConnectionTextField } from '../connection-form.type';

const textPatch = (key: ConnectionTextField, text: string): Partial<ConnectionForm> => {
  const patch: Partial<ConnectionForm> = {};
  patch[key] = text;
  return patch;
};

export { textPatch };
