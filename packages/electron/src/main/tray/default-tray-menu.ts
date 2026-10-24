/* @layer electron-main @kind logic */
import type { TrayMenuItem } from '@drizztdourden08/brock-core/product';

const defaultTrayMenu = (productName: string): TrayMenuItem[] => [
  { label: `Show ${productName}`, action: 'show' },
  { type: 'separator' },
  { label: 'Quit', action: 'quit' },
];

export { defaultTrayMenu };
