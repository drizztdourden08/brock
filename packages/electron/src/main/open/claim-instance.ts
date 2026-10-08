/* @layer electron-main @kind logic */
import type { ProductConfig } from '@drizztdourden08/brock-core/product';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import { isInstanceLaunch } from '../instance/is-instance-launch';
import { installOpenSources } from './install-open-sources';
import { openTargets } from './open-targets';
import { shouldLockInstance } from './should-lock-instance';

const claimInstance = (product: ProductConfig, wanted: boolean | undefined, flags: AutomationFlags): boolean => {
  const targets = openTargets(product);
  const lock = shouldLockInstance({ wanted, targets, automation: flags.isAutomationLaunch(), namedInstance: isInstanceLaunch() });
  return installOpenSources(targets, lock);
};

export { claimInstance };
