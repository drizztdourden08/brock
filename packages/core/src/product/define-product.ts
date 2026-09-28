/* @layer core @kind logic */
import type { ProductConfig, ProductIcons, ProductInput, WindowConfig } from './product.type';
import { BRAND_ICONS, DEFAULT_WINDOW, REVERSE_DNS, SLUG } from './define-product.constants';

const toEnvPrefix = (id: string): string => id.replace(/[^a-z0-9]+/gi, '_').toUpperCase();

const assertProductInput = (input: ProductInput): void => {
  if (!SLUG.test(input.id)) throw new Error(`product.id "${input.id}" must be a slug like "my-app"`);
  if (!REVERSE_DNS.test(input.appId)) throw new Error(`product.appId "${input.appId}" must be reverse-DNS like "com.example.my-app"`);
  if (!input.name.trim()) throw new Error('product.name is required');
};

const resolveWindow = (input: ProductInput): WindowConfig => ({
  ...DEFAULT_WINDOW,
  ...(input.window ?? {}),
  title: input.window?.title ?? input.name,
});

const resolveIcons = (icons: ProductIcons = {}): ProductIcons =>
  icons.brand ? { ...BRAND_ICONS, ...icons } : icons;

const defineProduct = (input: ProductInput): ProductConfig => {
  assertProductInput(input);
  return {
    id: input.id,
    name: input.name,
    appId: input.appId,
    description: input.description,
    author: input.author,
    repo: input.repo,
    updateChannel: input.updateChannel,
    artifactPrefix: input.artifactPrefix ?? `${input.id}-`,
    envPrefix: input.envPrefix ?? toEnvPrefix(input.id),
    window: resolveWindow(input),
    dataDirs: input.dataDirs ?? ['profiles', 'config'],
    schemes: input.schemes ?? [],
    fileAssociations: input.fileAssociations ?? [],
    icons: resolveIcons(input.icons),
    modules: input.modules ?? [],
  };
};

export { defineProduct };
