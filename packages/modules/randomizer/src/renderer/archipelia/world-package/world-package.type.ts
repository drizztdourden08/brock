/* @layer renderer-shell @kind types */
type WorldPackageBuild = {
  archipelagoVersion: string;
  file: string;
  sha256: string;
  size: number;
};

type WorldPackageBuilds = {
  minimumAp: string;
  maximumAp: string;
  builds: WorldPackageBuild[];
};

export type { WorldPackageBuild, WorldPackageBuilds };
