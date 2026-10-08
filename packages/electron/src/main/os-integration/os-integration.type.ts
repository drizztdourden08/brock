/* @layer electron-main @kind types */
import type { ProductConfig } from '@drizztdourden08/brock-core/product';

type OsIntegrationProduct = Pick<ProductConfig, 'id' | 'name' | 'protocols' | 'fileAssociations'>;

interface RegistryValue {
  key: string;
  name: string | null;
  value: string;
}

interface RegistryRemoval {
  key: string;
  name: string | null;
}

type FileIconOf = (ext: string) => string;

export type { FileIconOf, OsIntegrationProduct, RegistryRemoval, RegistryValue };
