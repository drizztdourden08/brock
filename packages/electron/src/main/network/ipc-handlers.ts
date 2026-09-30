/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { lanAddresses } from './lan-addresses';

const networkHandlers: HandlerGroup = {
  id: 'network',
  register: ({ handle }) => {
    handle('network:lanAddresses', () => lanAddresses());
  },
};

export { networkHandlers };
