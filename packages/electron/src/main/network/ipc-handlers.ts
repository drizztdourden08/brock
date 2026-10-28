/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { assertAppFrame } from '../ipc/assert-app-frame';
import { electronNetTransport } from './electron-net-transport';
import { lanAddresses } from './lan-addresses';
import { netRead } from './net-read';

const networkHandlers: HandlerGroup = {
  id: 'network',
  register: ({ handle, product }) => {
    handle('network:lanAddresses', () => lanAddresses());
    handle('net:read', (event, url, options) => {
      assertAppFrame(event);
      return netRead(product.net, electronNetTransport, url, options);
    });
  },
};

export { networkHandlers };
