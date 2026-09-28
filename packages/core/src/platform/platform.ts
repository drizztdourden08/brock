/* @layer core @kind logic */
import type { PlatformPorts } from '../augment';
import type { Platform } from './platform.type';
import type { PlatformFactory } from './factory.type';

const createPlatform = (factory: PlatformFactory): Platform => {
  const ports: Record<string, unknown> = {};
  for (const [key, make] of Object.entries(factory.ports as Record<string, () => unknown>)) ports[key] = make();
  return { info: factory.info, capabilities: factory.capabilities, ...(ports as unknown as PlatformPorts) };
};

export { createPlatform };
