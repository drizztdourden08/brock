/* @layer electron-main @kind types */
import type { ProductConfig } from '@drizztdourden08/brock-core/product';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { ProfileStoreHooks } from '@drizztdourden08/brock-core/storage';
import type { InstanceInfo } from '../types/main-context.type';

interface ContextInput {
  product: ProductConfig;
  flags: AutomationFlags;
  instance: InstanceInfo;
  profileHooks?: ProfileStoreHooks;
}

export type { ContextInput };
