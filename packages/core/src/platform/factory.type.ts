/* @layer core @kind types */
import type { Capabilities, PlatformPorts } from '../augment';
import type { PlatformInfo } from './platform.type';

type PortCreators = { [K in keyof PlatformPorts]: () => PlatformPorts[K] };

interface PlatformFactory {
  readonly info: PlatformInfo;
  readonly capabilities: Capabilities;
  readonly ports: PortCreators;
}

export type { PlatformFactory, PortCreators };
