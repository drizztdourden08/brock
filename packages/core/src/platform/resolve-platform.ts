/* @layer core @kind logic */
import type { Platform } from './platform.type';
import type { FactoryMap } from './resolve-platform.type';
import { detectHost } from './detect';
import { createPlatform } from './platform';

const resolvePlatform = (factories: FactoryMap): Platform => {
  const host = detectHost();
  const make = factories[host] ?? factories.web ?? factories.electron;
  if (!make) throw new Error(`No platform factory registered for host "${host}"`);
  return createPlatform(make());
};

export { resolvePlatform };
