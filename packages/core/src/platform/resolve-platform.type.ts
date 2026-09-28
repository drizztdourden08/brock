/* @layer core @kind types */
import type { HostShell } from './platform.type';
import type { PlatformFactory } from './factory.type';

type FactoryMap = Partial<Record<HostShell, () => PlatformFactory>>;

export type { FactoryMap };
