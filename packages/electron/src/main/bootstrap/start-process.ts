/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { ProductConfig } from '@drizztdourden08/brock-core/product';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { BootstrapOptions } from '../types/main-context.type';
import type { ProcessStart } from './bootstrap-app.type';
import { applyPortableMode } from '../app/portable-mode';
import { applyUserDataArg } from '../app/user-data-arg';
import { claimInstance } from '../open/claim-instance';
import { applyOsIntegrationFlag } from '../os-integration/apply-os-integration-flag';

const startProcess = (product: ProductConfig, options: BootstrapOptions): ProcessStart | null => {
  if (applyOsIntegrationFlag(product)) return null;
  const modules = options.modules ?? [];
  for (const module of modules) module.onBoot?.(product);
  const portableData = applyPortableMode();
  const userDataOverride = applyUserDataArg();
  app.setName(product.id);
  const flags = createAutomationFlags([
    ...modules.flatMap((m) => m.automationFlags ?? []),
    ...(options.automationFlags ?? []),
  ]);
  if (!claimInstance(product, options.singleInstance, flags)) {
    app.exit(0);
    return null;
  }
  return { flags, portableData, userDataOverride };
};

export { startProcess };
