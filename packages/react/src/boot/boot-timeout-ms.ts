/* @layer renderer-shell @kind logic */
import { hostApi } from '../host/host-api';

const bootTimeoutMs = (): number | undefined => {
  const value = Number(hostApi()?.startup.flags['boot-timeout']);
  return Number.isFinite(value) && value > 0 ? value : undefined;
};

export { bootTimeoutMs };
