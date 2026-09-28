/* @layer renderer-shell @kind logic */
import { platformState } from './platform-state';
import type { ModulePorts } from './platform.type';

const setPlatformPorts = (ports: ModulePorts): void => {
  platformState.ports = ports;
  platformState.platform = null;
};

export { setPlatformPorts };
