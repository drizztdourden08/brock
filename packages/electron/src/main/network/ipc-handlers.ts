/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { electronNetTransport } from './electron-net-transport';
import { lanAddresses } from './lan-addresses';
import { netRead } from './net-read';

const networkHandlers: HandlerGroup = {
  id: 'network',
  register: ({ handle, product }) => {
    handle('network:lanAddresses', () => lanAddresses());
    handle('net:read', (_event, url, options) => netRead(product.net, electronNetTransport, url, options));
  },
};

export { networkHandlers };
