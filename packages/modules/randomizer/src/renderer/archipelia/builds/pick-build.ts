/* @layer renderer-shell @kind logic */
import type { WorldPackageBuild } from '../world-package/world-package.type';

const pickBuild = (builds: readonly WorldPackageBuild[], ap: string): WorldPackageBuild | null =>
  builds.find((build) => build.archipelagoVersion === ap) ?? null;

export { pickBuild };
