/* @layer core @kind types */
interface ModuleCiStep {
  name: string;
  run: string;
  os?: 'windows' | 'linux' | 'macos';
}

interface ModuleMigration {
  version: string;
  entry: string;
  summary: string;
}

interface ModuleDoctorCheck {
  name: string;
  os: 'windows' | 'linux' | 'macos';
  probe: string[];
  install: string;
}

interface ModuleExtraResource {
  from: string;
  to: string;
}

interface ModuleAndroidSide {
  sdkPackages?: string[];
}

interface BrockModuleManifest {
  id: string;
  description: string;
  main?: string;
  preload?: string;
  renderer?: string;
  automationFlags?: string[];
  dataDirs?: string[];
  peers?: string[];
  ci?: ModuleCiStep[];
  migrations?: ModuleMigration[];
  prepare?: string;
  extraResources?: ModuleExtraResource[];
  packExclude?: string[];
  doctor?: ModuleDoctorCheck[];
  udevRules?: string;
  android?: ModuleAndroidSide;
}

interface ResolvedModule {
  packageName: string;
  version: string;
  manifest: BrockModuleManifest;
}

export type { BrockModuleManifest, ModuleAndroidSide, ModuleCiStep, ModuleDoctorCheck, ModuleExtraResource, ModuleMigration, ResolvedModule };
