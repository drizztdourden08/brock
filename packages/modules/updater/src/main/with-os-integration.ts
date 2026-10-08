/* @layer electron-main @kind logic */
import type { OsIntegrationProduct } from '@drizztdourden08/brock-electron/main';
import type { OsIntegrationSteps, VelopackHook, VelopackHooks } from './updater-main.type';

const before = (step: () => unknown, hook: VelopackHook | undefined): VelopackHook => (version) => {
  step();
  hook?.(version);
};

const withOsIntegration = (product: OsIntegrationProduct, hooks: VelopackHooks, steps: OsIntegrationSteps): VelopackHooks => {
  if (product.protocols.length === 0 && product.fileAssociations.length === 0) return hooks;
  const register = (): unknown => steps.register(product);
  return {
    ...hooks,
    afterInstall: before(register, hooks.afterInstall),
    afterUpdate: before(register, hooks.afterUpdate),
    beforeUninstall: before(() => steps.unregister(product), hooks.beforeUninstall),
  };
};

export { withOsIntegration };
