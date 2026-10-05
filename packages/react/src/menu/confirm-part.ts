/* @layer renderer-shell @kind logic */
import type { MenuItem as TesseraMenuItem } from '@drizztdourden08/tessera/composites';
import type { MenuItem } from './menu.type';

const confirmPart = (item: MenuItem): Partial<TesseraMenuItem> => {
  const { confirm } = item;
  if (confirm === undefined) return {};
  return typeof confirm === 'string' ? { kind: 'confirm', confirm } : { kind: 'confirm' };
};

export { confirmPart };
