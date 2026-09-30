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

interface WindowConfig {
  title?: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  backgroundColor: string;
  splash: SplashConfig;
}

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

interface ProductIcons {
  brand?: string;
  ico?: string;
  png256?: string;
  png512?: string;
}

interface ProductLogos {
  app: string;
  instance: string;
  mark: string;
}

interface ProductPorts {
  base: number;
  strict?: boolean;
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
  modules: string[];
  ports?: ProductPorts;
}

type ProductInput = Pick<ProductConfig, 'id' | 'name' | 'appId' | 'author'> &
  Partial<Omit<ProductConfig, 'id' | 'name' | 'appId' | 'author' | 'window' | 'logos'>> & {
    window?: Partial<WindowConfig>;
    logos?: Partial<ProductLogos>;
  };

export type {
  ProductAuthor, ProductRepo, SplashConfig, WindowConfig, PrivilegedScheme, FileAssociation,
  ProductIcons, ProductLogos, ProductPorts, ProductConfig, ProductInput,
};
