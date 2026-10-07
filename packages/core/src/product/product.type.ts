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
}

interface WindowConfig {
  title?: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  backgroundColor: string;
  splash: SplashConfig;
  titleBar: TitleBarConfig;
}

type WindowInput = Partial<Omit<WindowConfig, 'titleBar'>> & { titleBar?: { controls?: Partial<TitleBarControls> } };

interface PrivilegedScheme {
  scheme: string;
  stream?: boolean;
}

interface FileAssociation {
  ext: string;
  name: string;
  progId: string;
  mimeType?: string;
  icon?: string;
}

type ProductIconRim = 'light' | 'dark';

interface ProductIcons {
  brand?: string;
  rim?: ProductIconRim;
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

interface ProductConfig {
  id: string;
  name: string;
  appId: string;
  description?: string;
  author: ProductAuthor;
  repo?: ProductRepo;
  updateChannel?: string;
  accent?: string;
  look?: ProductLook;
  artifactPrefix: string;
  envPrefix: string;
  window: WindowConfig;
  dataDirs: string[];
  schemes: PrivilegedScheme[];
  fileAssociations: FileAssociation[];
  icons: ProductIcons;
  logos: ProductLogos;
  homeScreen: string;
  ports?: ProductPorts;
  widgets: ProductWidgets;
  installer: InstallerConfig;
}

type ProductInput = Pick<ProductConfig, 'id' | 'name' | 'appId' | 'author'> &
  Partial<Omit<ProductConfig, 'id' | 'name' | 'appId' | 'author' | 'window' | 'logos' | 'installer' | 'widgets'>> & {
    window?: WindowInput;
    logos?: Partial<ProductLogos>;
    installer?: InstallerInput;
    widgets?: Partial<ProductWidgets>;
  };

export type {
  ProductAuthor, ProductRepo, SplashConfig, TitleBarConfig, TitleBarControls, WindowConfig, WindowInput, PrivilegedScheme, FileAssociation,
  ProductIconRim, ProductIcons, ProductLogos, ProductPorts, ProductWidgets, ProductConfig, ProductInput,
  InstallScope, InstallerShortcuts, InstallerConfig, InstallerInput,
};
