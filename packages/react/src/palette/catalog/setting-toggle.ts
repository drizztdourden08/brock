/* @layer renderer-shell @kind logic */
import type { CatalogInput, SearchToggle } from '../palette.type';

const settingToggle = (key: string, input: CatalogInput): SearchToggle | undefined => {
  if (key.includes('.') || input.settings === null) return undefined;
  const value: unknown = (input.settings as Record<string, unknown>)[key];
  if (typeof value !== 'boolean') return undefined;
  return { value, flip: () => input.patch({ [key]: !value }) };
};

export { settingToggle };
