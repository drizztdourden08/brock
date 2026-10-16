/* @layer renderer-shell @kind types */
import type { HostShell, PlatformInfo, PortCreators } from '@drizztdourden08/brock-core';

type ModulePorts = Partial<Record<HostShell, Partial<PortCreators>>>;

type WebDevice = Pick<PlatformInfo, 'formFactor' | 'input'>;

export type { ModulePorts, WebDevice };
