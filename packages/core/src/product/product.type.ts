/* @layer core @kind types */
import type { ProductLook } from '../look/look.type';

interface ProductAuthor {
  name: string;
  email?: string;
}

interface ProductRepo {
  owner: string;
  name: string;
}

interface SplashConfig {
  width: number;
  height: number;
  accent?: string;
}

interface TitleBarControls {
  fullscreen: boolean;
  pin: boolean;
  minimize: boolean;
  maximize: boolean;
}

interface TitleBarConfig {
  controls: TitleBarControls;
  mobile: boolean;
}

interface WindowConfig {
  title?: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  backgroundColor: string;
  splash: SplashConfig;
  titleBar: TitleBarConfig;
}

type WindowInput = Partial<Omit<WindowConfig, 'titleBar'>> & { titleBar?: { controls?: Partial<TitleBarControls>; mobile?: boolean } };

interface PrivilegedScheme {
  scheme: string;
  stream?: boolean;
  dir?: string;
}

interface DeepLinkProtocol {
  scheme: string;
  name?: string;
}

interface FileAssociation {
  ext: string;
  name: string;
  description?: string;
  progId: string;
  mimeType?: string;
  icon?: string;
}

type ProductIconRim = 'light' | 'dark';

type ProductWordmarkRendering = 'auto' | 'pixelated';

interface ProductWordmark {
  src: string;
  dark: string;
  rendering?: 'pixelated';
}

type ProductWordmarkInput = string | { src: string; dark?: string; rendering?: ProductWordmarkRendering };

interface ProductIcons {
  brand?: string;
  rim?: ProductIconRim;
  wordmark?: ProductWordmark;
  ico?: string;
  png256?: string;
  png512?: string;
}

interface ProductLogos {
  app: string;
  instance: string;
  mark: string;
}

type InstallScope = 'user' | 'machine';

type LinuxCategory = 'AudioVideo' | 'Audio' | 'Video' | 'Development' | 'Education' | 'Game' | 'Graphics' | 'Network' | 'Office' | 'Science' | 'Settings' | 'System' | 'Utility';

interface InstallerShortcuts {
  desktop: boolean;
  startMenu: boolean;
}

interface InstallerConfig {
  scope: InstallScope;
  shortcuts: InstallerShortcuts;
  launchAfterInstall: boolean;
  licence?: string;
  folderName: string;
}

type InstallerInput = Partial<Omit<InstallerConfig, 'shortcuts'>> & { shortcuts?: Partial<InstallerShortcuts> };

interface ProductPorts {
  base: number;
  strict?: boolean;
}

interface ProductWidgets {
  mainLabel: string;
  keepFocusWithApp: boolean;
}

interface ProductBoot {
  watchdogMs?: number;
  devWatchdogMs?: number;
}

type ProductMenuGroup = 'main' | 'sections' | 'modules' | 'end';

interface ProductMenuEntry {
  hidden?: boolean;
  inMenu?: boolean;
  label?: string;
  activeLabel?: string;
  group?: ProductMenuGroup;
  order?: number;
  before?: string;
  after?: string;
  parent?: string | null;
}

interface ProductMenu {
  entries?: Readonly<Record<string, ProductMenuEntry>>;
}

interface ProductMascot {
  searchHint?: string;
}

interface ProductConfig {
  id: string;
  name: string;
  appId: string;
  description?: string;
  author: ProductAuthor;
  copyright?: string;
  linuxCategory?: LinuxCategory;
  repo?: ProductRepo;
  updateChannel?: string;
  releaseTagPrefix?: string;
  accent?: string;
  look?: ProductLook;
  artifactPrefix: string;
  envPrefix: string;
  window: WindowConfig;
  dataDirs: string[];
  schemes: PrivilegedScheme[];
  protocols: DeepLinkProtocol[];
  fileAssociations: FileAssociation[];
  icons: ProductIcons;
  logos: ProductLogos;
  homeScreen: string;
  profilesRoute?: string;
  singleProfile?: boolean;
  ports?: ProductPorts;
  widgets: ProductWidgets;
  installer: InstallerConfig;
  boot?: ProductBoot;
  menu?: ProductMenu;
  mascot?: false | ProductMascot;
}

type ProductIconsInput = Omit<ProductIcons, 'wordmark'> & { wordmark?: ProductWordmarkInput };

type ProductInput = Pick<ProductConfig, 'id' | 'name' | 'appId' | 'author'> &
  Partial<Omit<ProductConfig, 'id' | 'name' | 'appId' | 'author' | 'window' | 'logos' | 'installer' | 'widgets' | 'icons'>> & {
    icons?: ProductIconsInput;
    window?: WindowInput;
    logos?: Partial<ProductLogos>;
    installer?: InstallerInput;
    widgets?: Partial<ProductWidgets>;
  };

export type {
  ProductAuthor, ProductRepo, SplashConfig, TitleBarConfig, TitleBarControls, WindowConfig, WindowInput, PrivilegedScheme, DeepLinkProtocol, FileAssociation,
  ProductIconRim, ProductIcons, ProductIconsInput, ProductWordmark, ProductWordmarkInput, ProductWordmarkRendering, ProductLogos, ProductPorts, ProductWidgets, ProductBoot, ProductConfig, ProductInput, ProductMenu, ProductMenuEntry, ProductMenuGroup, ProductMascot,
  InstallScope, InstallerShortcuts, InstallerConfig, InstallerInput, LinuxCategory,
};
