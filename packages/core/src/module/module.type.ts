/* @layer core @kind types */
interface ModuleCiStep {
  name: string;
  run: string;
  os?: 'windows' | 'linux' | 'macos';
}

type WorkflowRunnerOs = 'windows' | 'linux' | 'macos';

type WorkflowPermissionLevel = 'read' | 'write' | 'none';

type WorkflowPermissions = Partial<Record<
  'actions' | 'attestations' | 'checks' | 'contents' | 'deployments' | 'discussions' | 'id-token' | 'issues' | 'models' | 'packages' | 'pages'
  | 'pull-requests' | 'security-events' | 'statuses',
  WorkflowPermissionLevel
>>;

interface WorkflowAttest {
  paths: string[];
  stage: 'beforePackage' | 'afterPackage';
}

interface WorkflowPublish {
  packages: string[];
  registry?: 'github';
}

interface WorkflowStep {
  name: string;
  id?: string;
  run?: string;
  uses?: string;
  with?: Record<string, string | number | boolean>;
  env?: Record<string, string>;
  shell?: string;
  if?: string;
  secrets?: string[];
  os?: WorkflowRunnerOs | WorkflowRunnerOs[];
  platforms?: string[];
  jobs?: string | string[];
  permissions?: WorkflowPermissions;
}

interface CiWorkflowSteps {
  beforeInstall?: WorkflowStep[];
  beforeBuild?: WorkflowStep[];
  afterBuild?: WorkflowStep[];
  beforeTest?: WorkflowStep[];
}

interface ReleaseWorkflowSteps {
  beforeInstall?: WorkflowStep[];
  prepare?: WorkflowStep[];
  beforePackage?: WorkflowStep[];
  afterPackage?: WorkflowStep[];
}

interface WorkflowSteps {
  ci?: CiWorkflowSteps;
  release?: ReleaseWorkflowSteps;
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
  workflows?: WorkflowSteps;
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

export type {
  BrockModuleManifest, CiWorkflowSteps, ModuleAndroidSide, ModuleCiStep, ModuleDoctorCheck, ModuleExtraResource, ModuleMigration, ReleaseWorkflowSteps, ResolvedModule,
  WorkflowAttest, WorkflowPermissionLevel, WorkflowPermissions, WorkflowPublish, WorkflowRunnerOs, WorkflowStep, WorkflowSteps,
};
