/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { allowFirewall } from './allow-firewall';
import { createLanDiscovery } from './create-lan-discovery';
import type { MdnsFactory } from './lan.type';
import { readFirewallStatus } from './read-firewall-status';

type LanHandlerContext = Pick<MainContext, 'handle' | 'emit' | 'product'>;

const registerLanHandlers = ({ handle, emit, product }: LanHandlerContext, mdns?: MdnsFactory): void => {
  const discovery = createLanDiscovery((sighting) => emit('randomizer:lan:sighting', sighting), mdns);

  handle('randomizer:lan:start', (_event, settings) => {
    discovery.start(settings);
    return Promise.resolve();
  });

  handle('randomizer:lan:stop', () => {
    discovery.stop();
    return Promise.resolve();
  });

  handle('randomizer:lan:firewall-status', () => readFirewallStatus());

  handle('randomizer:lan:firewall-allow', () => allowFirewall(product.name));
};

export { registerLanHandlers };
