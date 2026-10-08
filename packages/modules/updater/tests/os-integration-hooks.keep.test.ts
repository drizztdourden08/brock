/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { withOsIntegration } from '../src/main/with-os-integration';

const PRODUCT = {
  id: 'relic', name: 'Relic', protocols: [{ scheme: 'relic' }], fileAssociations: [],
};

describe('withOsIntegration', () => {
  it('registers on install and update and removes on uninstall, before the app hooks', () => {
    const calls: string[] = [];
    const steps = { register: () => calls.push('register'), unregister: () => calls.push('unregister') };
    const hooks = withOsIntegration(PRODUCT, { afterInstall: (v) => calls.push(`app install ${v}`) }, steps);
    hooks.afterInstall?.('1.0.0');
    hooks.afterUpdate?.('1.0.1');
    hooks.beforeUninstall?.('1.0.1');
    expect(calls).toEqual(['register', 'app install 1.0.0', 'register', 'unregister']);
  });

  it('leaves the hooks alone for an app with nothing to register', () => {
    const hooks = { firstRun: () => undefined };
    const steps = { register: () => undefined, unregister: () => undefined };
    expect(withOsIntegration({ ...PRODUCT, protocols: [] }, hooks, steps)).toBe(hooks);
  });
});
