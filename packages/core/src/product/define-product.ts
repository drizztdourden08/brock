/* @layer core @kind logic */
import type { ProductConfig, ProductIcons, ProductInput, ProductLogos, WindowConfig } from './product.type';
import { BRAND_ICONS, DEFAULT_HOME_SCREEN, DEFAULT_LOGOS, DEFAULT_WINDOW, HEX_COLOR, REVERSE_DNS, SLUG } from './define-product.constants';

const toEnvPrefix = (id: string): string => id.replace(/[^a-z0-9]+/gi, '_').toUpperCase();

const assertProductInput = (input: ProductInput): void => {
  if (!SLUG.test(input.id)) throw new Error(`product.id "${input.id}" must be a slug like "my-app"`);
  if (!REVERSE_DNS.test(input.appId)) throw new Error(`product.appId "${input.appId}" must be reverse-DNS like "com.example.my-app"`);
  if (!input.name.trim()) throw new Error('product.name is required');
  if (input.accent !== undefined && !HEX_COLOR.test(input.accent)) throw new Error(`product.accent "${input.accent}" must be a colour like "#e8a33d"`);
};

const resolveWindow = (input: ProductInput): WindowConfig => ({
  ...DEFAULT_WINDOW,
  ...(input.window ?? {}),
  title: input.window?.title ?? input.name,
});

const resolveIcons = (icons: ProductIcons = {}): ProductIcons =>
  icons.brand ? { ...BRAND_ICONS, ...icons } : icons;

const resolveLogos = (logos: Partial<ProductLogos> = {}): ProductLogos => {
  const app = logos.app ?? DEFAULT_LOGOS.app;
  return { app, instance: logos.instance ?? (logos.app ? app : DEFAULT_LOGOS.instance) };
};

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
    accent: input.accent,
    artifactPrefix: input.artifactPrefix ?? `${input.id}-`,
    envPrefix: input.envPrefix ?? toEnvPrefix(input.id),
    window: resolveWindow(input),
    dataDirs: input.dataDirs ?? ['profiles', 'config'],
    schemes: input.schemes ?? [],
    fileAssociations: input.fileAssociations ?? [],
    icons: resolveIcons(input.icons),
    logos: resolveLogos(input.logos),
    homeScreen: input.homeScreen ?? DEFAULT_HOME_SCREEN,
    modules: input.modules ?? [],
  };
};

export { defineProduct };
