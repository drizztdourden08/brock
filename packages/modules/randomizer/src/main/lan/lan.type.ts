/* @layer electron-main @kind types */
import type { LanDiscoverySettings } from '../../archipelago/lobby';
import type { FirewallStatus } from '../../ipc/lan-host-api.type';

type MdnsService = {
  fqdn: string;
  host: string;
  port: number;
  addresses?: string[];
  txt?: unknown;
};

type MdnsBrowser = {
  on: (event: 'up' | 'down', listener: (service: MdnsService) => void) => unknown;
  stop: () => void;
};

type MdnsEngine = {
  find: (query: { type: string; protocol: 'tcp' | 'udp' }) => MdnsBrowser;
  destroy: () => void;
};

type MdnsFactory = () => MdnsEngine;

type LanDiscovery = {
  start: (settings: LanDiscoverySettings) => void;
  stop: () => void;
};

export type { FirewallStatus, LanDiscovery, MdnsBrowser, MdnsEngine, MdnsFactory, MdnsService };
