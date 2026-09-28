/* @layer core @kind types */
interface ProductAuthor {
  name: string;
  email?: string;
}

interface ProductRepo {
  owner: string;
  name: string;
}

interface WindowConfig {
  title?: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  backgroundColor: string;
  splash: { width: number; height: number };
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

interface ProductConfig {
  id: string;
  name: string;
  appId: string;
  description?: string;
  author: ProductAuthor;
  repo?: ProductRepo;
  artifactPrefix: string;
  envPrefix: string;
  window: WindowConfig;
  dataDirs: string[];
  schemes: PrivilegedScheme[];
  fileAssociations: FileAssociation[];
  icons: ProductIcons;
  modules: string[];
}

type ProductInput = Pick<ProductConfig, 'id' | 'name' | 'appId' | 'author'> &
  Partial<Omit<ProductConfig, 'id' | 'name' | 'appId' | 'author' | 'window'>> & {
    window?: Partial<WindowConfig>;
  };

export type {
  ProductAuthor, ProductRepo, WindowConfig, PrivilegedScheme, FileAssociation,
  ProductIcons, ProductConfig, ProductInput,
};
