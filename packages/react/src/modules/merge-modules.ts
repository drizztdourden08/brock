/* @layer renderer-shell @kind logic */
import type { HostShell, PortCreators } from '@drizztdourden08/brock-core';
import type { ModulePorts } from '../platform/platform.type';
import type { MergedModules, RendererModule } from './renderer-module.type';

const mergePorts = (all: ModulePorts[]): ModulePorts => {
  const merged: ModulePorts = {};
  for (const ports of all) {
    for (const [host, creators] of Object.entries(ports) as [HostShell, Partial<PortCreators>][]) {
      merged[host] = { ...(merged[host] ?? {}), ...creators };
    }
  }
  return merged;
};

const mergeModules = (modules: readonly RendererModule[]): MergedModules => ({
  screens: modules.flatMap((m) => m.screens ?? []),
  settingsTabs: modules.flatMap((m) => m.settingsTabs ?? []),
  menu: modules.flatMap((m) => m.menu ?? []),
  providers: modules.flatMap((m) => (m.Provider ? [m.Provider] : [])),
  titleBar: modules.flatMap((m) => m.titleBar ?? []),
  ports: mergePorts(modules.flatMap((m) => (m.ports ? [m.ports] : []))),
  logChannels: [...new Set(modules.flatMap((m) => m.logChannels ?? []))],
});

export { mergeModules };
