/* @layer core @kind logic */
import type { PlatformFactory, PortCreators } from './factory.type';

const withPorts = (factory: PlatformFactory, extra: Partial<PortCreators>): PlatformFactory => ({
  ...factory,
  ports: { ...factory.ports, ...extra },
});

export { withPorts };
