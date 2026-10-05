/* @layer renderer-shell @kind logic */
import type { MenuItem as TesseraMenuItem } from '@drizztdourden08/tessera/composites';
import type { MenuItem } from './menu.type';

const confirmPart = (item: MenuItem): Partial<TesseraMenuItem> => {
  const { confirm, onCancel } = item;
  if (confirm === undefined) return {};
  return { kind: 'confirm', ...(typeof confirm === 'string' ? { confirm } : {}), ...(onCancel ? { onCancel } : {}) };
};

export { confirmPart };
