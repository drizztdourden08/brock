/* @layer tooling-scripts @kind logic */
import { compareVersions } from './compare-versions.mjs';
import { CHECK_EXIT } from './upgrade.constants.mjs';

/**
 * @param {import('./upgrade.type.mjs').UpgradePlan} plan
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {number} 0 up to date, 1 behind
 */
const checkUpgrade = (plan, ctx) => {
  const linked = plan.mode === 'link';
  const source = linked ? `the linked checkout ${plan.checkout}` : 'the registry';
  const behind = plan.current === null || compareVersions(plan.current, plan.target) < 0;
  ctx.log(`Current: Brock ${plan.current ?? 'unknown'}. Target: Brock ${plan.target} from ${source}.`);
  if (linked) ctx.log('Brock is linked, so an upgrade follows that checkout: sync, migrations and the gate.');
  ctx.log(behind ? `Behind. Upgrade with: ${ctx.workspace.name} upgrade` : 'Up to date.');
  return behind ? CHECK_EXIT.behind : CHECK_EXIT.upToDate;
};

export { checkUpgrade };
