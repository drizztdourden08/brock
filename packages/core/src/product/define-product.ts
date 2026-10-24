/* @layer core @kind logic */
import type {
  InstallerConfig, ProductConfig, ProductIcons, ProductIconsInput, ProductInput, ProductLogos, ProductPorts, ProductWidgets, WindowConfig,
} from './product.type';
import {
  BRAND_APP_LOGO, BRAND_ICONS, BRAND_RIMS, DEFAULT_HOME_SCREEN, DEFAULT_INSTALLER, DEFAULT_LOGOS, DEFAULT_WIDGETS, DEFAULT_WINDOW, HEX_COLOR, INSTALL_SCOPES, LICENCE_FILE,
  PORT_BASE_MAX, PORT_BASE_MIN, REVERSE_DNS, SLUG, UNSAFE_FILE_CHARS,
} from './define-product.constants';
import { assertOsIntegration } from './assert-os-integration';
import { resolveWordmark } from './resolve-wordmark';

const toEnvPrefix = (id: string): string => id.replace(/[^a-z0-9]+/gi, '_').toUpperCase();

const assertPorts = (ports: ProductPorts | undefined): void => {
  if (!ports) return;
  const { base } = ports;
  if (!Number.isInteger(base) || base < PORT_BASE_MIN || base > PORT_BASE_MAX) throw new Error(`product.ports.base ${base} must be a whole number from ${PORT_BASE_MIN} to ${PORT_BASE_MAX}`);
};

const assertLook = (look: ProductInput['look']): void => {
  const stops = look?.gradient.filter((stop): stop is string => stop !== undefined) ?? [];
  const bad = stops.find((stop) => !HEX_COLOR.test(stop));
  if (bad !== undefined) throw new Error(`product.look.gradient stop "${bad}" must be a colour like "#e8a33d"`);
};

const assertInstaller = (installer: ProductInput['installer']): void => {
  if (!installer) return;
  const { scope, licence, folderName } = installer;
  if (scope !== undefined && !INSTALL_SCOPES.includes(scope)) throw new Error(`product.installer.scope "${scope}" must be one of ${INSTALL_SCOPES.join(', ')}`);
  if (licence !== undefined && !LICENCE_FILE.test(licence)) throw new Error(`product.installer.licence "${licence}" must be a .md or .txt file`);
  if (folderName !== undefined && (!folderName.trim() || folderName.replace(UNSAFE_FILE_CHARS, '') !== folderName)) {
    throw new Error(`product.installer.folderName "${folderName}" must be a plain folder name`);
  }
};

const assertBoot = (boot: ProductInput['boot']): void => {
  for (const [key, ms] of Object.entries(boot ?? {})) {
    if (ms !== undefined && (!Number.isInteger(ms) || ms <= 0)) throw new Error(`product.boot.${key} ${ms} must be a whole number of milliseconds above 0`);
  }
};

const assertMascot = (mascot: ProductInput['mascot']): void => {
  if (mascot === undefined || mascot === false) return;
  if (mascot.searchHint !== undefined && !mascot.searchHint.trim()) throw new Error('product.mascot.searchHint must be a sentence, or left out for the default');
};

const assertTray = (tray: ProductInput['tray']): void => {
  if (!tray) return;
  if (!tray.tooltip.trim()) throw new Error('product.tray.tooltip is required');
  const ids = new Set<string>();
  for (const item of tray.menu ?? []) {
    if ('type' in item) continue;
    if (!item.label.trim()) throw new Error('product.tray.menu items need a label');
    if (!('id' in item)) continue;
    if (!item.id.trim() || ids.has(item.id)) throw new Error(`product.tray.menu id "${item.id}" must be unique and not empty`);
    ids.add(item.id);
  }
};

const assertProductInput = (input: ProductInput): void => {
  if (!SLUG.test(input.id)) throw new Error(`product.id "${input.id}" must be a slug like "my-app"`);
  if (!REVERSE_DNS.test(input.appId)) throw new Error(`product.appId "${input.appId}" must be reverse-DNS like "com.example.my-app"`);
  if (!input.name.trim()) throw new Error('product.name is required');
  if (input.accent !== undefined && !HEX_COLOR.test(input.accent)) throw new Error(`product.accent "${input.accent}" must be a colour like "#e8a33d"`);
  assertLook(input.look);
  assertPorts(input.ports);
  assertInstaller(input.installer);
  assertBoot(input.boot);
  assertMascot(input.mascot);
  assertTray(input.tray);
  assertOsIntegration(input);
};

const resolveWindow = (input: ProductInput): WindowConfig => {
  const { titleBar, ...rest } = input.window ?? {};
  return {
    ...DEFAULT_WINDOW,
    ...rest,
    title: rest.title ?? input.name,
    titleBar: { controls: { ...DEFAULT_WINDOW.titleBar.controls, ...titleBar?.controls }, mobile: titleBar?.mobile ?? DEFAULT_WINDOW.titleBar.mobile },
  };
};

const resolveIcons = ({ wordmark: wordmarkInput, ...rest }: ProductIconsInput = {}): ProductIcons => {
  const wordmark = resolveWordmark(wordmarkInput);
  const icons: ProductIcons = wordmark ? { ...rest, wordmark } : rest;
  if (!icons.brand) return icons;
  const rim = icons.rim ?? BRAND_RIMS[icons.brand];
  return { ...BRAND_ICONS, ...icons, ...(rim ? { rim } : {}) };
};

const resolveLogos = (logos: Partial<ProductLogos> = {}, icons: ProductIconsInput = {}): ProductLogos => {
  const app = logos.app ?? (icons.brand ? BRAND_APP_LOGO : DEFAULT_LOGOS.app);
  return { app, instance: logos.instance ?? (logos.app ? app : DEFAULT_LOGOS.instance), mark: logos.mark ?? DEFAULT_LOGOS.mark };
};

const resolveInstaller = (input: ProductInput): InstallerConfig => {
  const { shortcuts, folderName, ...rest } = input.installer ?? {};
  return {
    ...DEFAULT_INSTALLER,
    ...rest,
    folderName: folderName ?? input.name.replace(UNSAFE_FILE_CHARS, '').trim(),
    shortcuts: { ...DEFAULT_INSTALLER.shortcuts, ...shortcuts },
  };
};

const resolveWidgets = (widgets: ProductInput['widgets'] = {}): ProductWidgets => ({
  mainLabel: widgets.mainLabel ?? DEFAULT_WIDGETS.mainLabel,
  keepFocusWithApp: widgets.keepFocusWithApp ?? DEFAULT_WIDGETS.keepFocusWithApp,
});

const optionalParts = ({ profilesRoute, singleProfile, boot, menu, mascot, tray }: ProductInput): Pick<ProductConfig, 'profilesRoute' | 'singleProfile' | 'boot' | 'menu' | 'mascot' | 'tray'> => ({
  ...(profilesRoute ? { profilesRoute } : {}),
  ...(singleProfile ? { singleProfile } : {}),
  ...(boot ? { boot } : {}),
  ...(menu ? { menu } : {}),
  ...(mascot !== undefined ? { mascot } : {}),
  ...(tray ? { tray } : {}),
});

const defineProduct = (input: ProductInput): ProductConfig => {
  assertProductInput(input);
  return {
    id: input.id,
    name: input.name,
    appId: input.appId,
    description: input.description,
    author: input.author,
    copyright: input.copyright,
    linuxCategory: input.linuxCategory,
    repo: input.repo,
    updateChannel: input.updateChannel,
    releaseTagPrefix: input.releaseTagPrefix,
    accent: input.accent,
    look: input.look,
    artifactPrefix: input.artifactPrefix ?? `${input.id}-`,
    envPrefix: input.envPrefix ?? toEnvPrefix(input.id),
    window: resolveWindow(input),
    dataDirs: input.dataDirs ?? ['profiles', 'config'],
    schemes: input.schemes ?? [],
    protocols: input.protocols ?? [],
    fileAssociations: input.fileAssociations ?? [],
    icons: resolveIcons(input.icons),
    logos: resolveLogos(input.logos, input.icons),
    homeScreen: input.homeScreen ?? DEFAULT_HOME_SCREEN,
    ports: input.ports,
    widgets: resolveWidgets(input.widgets),
    installer: resolveInstaller(input),
    ...optionalParts(input),
  };
};

export { defineProduct };
