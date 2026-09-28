/* @layer renderer-shell @kind types */
import type { HostShell, PortCreators } from '@drizztdourden08/brock-core';

type ModulePorts = Partial<Record<HostShell, Partial<PortCreators>>>;

export type { ModulePorts };
