/* @layer electron-main @kind logic */
import type { LanDiscoverySettings, LanSighting } from '../../archipelago/lobby';
import type { MdnsFactory } from './lan.type';

const textOf = (txt: unknown): Record<string, string> => {
  const entries = typeof txt === 'object' && txt !== null ? Object.entries(txt) : [];
  return Object.fromEntries(entries.filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
};

const browseMdns = (
  factory: MdnsFactory,
  settings: LanDiscoverySettings,
  report: (sighting: LanSighting) => void,
): (() => void) => {
  const engine = factory();
  const browser = engine.find({ type: settings.mdnsType, protocol: settings.mdnsProtocol });
  browser.on('up', (service) => {
    report({
      kind: 'mdns-up',
      key: service.fqdn,
      host: service.host,
      port: service.port,
      addresses: service.addresses ?? [],
      txt: textOf(service.txt),
    });
  });
  browser.on('down', (service) => {
    report({ kind: 'mdns-down', key: service.fqdn });
  });
  return () => {
    browser.stop();
    engine.destroy();
  };
};

export { browseMdns };
