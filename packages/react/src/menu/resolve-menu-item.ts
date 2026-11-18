/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';

type Resolved<D extends { label: Text; description?: Text }> = Omit<D, 'label' | 'description' | 'children'> & { label: string; description?: string };

const resolveMenuItem = <D extends { label: Text; description?: Text }>(def: D, text: (value: Text) => string): Resolved<D> => {
  const { label, description, ...rest } = def;
  return { ...rest, label: text(label), ...(description === undefined ? {} : { description: text(description) }) };
};

export { resolveMenuItem };
