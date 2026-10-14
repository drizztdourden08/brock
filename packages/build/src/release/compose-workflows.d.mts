/* @layer tooling-scripts @kind types */
interface SystemStep {
  name: string;
  run: string;
  os?: 'windows' | 'linux' | 'macos';
}

interface AppOfMany {
  name: string;
  tagPrefix: string;
  notesDir: string;
}

interface CheckedStep {
  name: string;
  run: string | null;
  uses: string | null;
  with: Record<string, string | number | boolean>;
  env: Record<string, string>;
  shell: string | null;
  if: string | null;
  secrets: string[];
  os: string[] | null;
  platforms: string[] | null;
  workingDirectory?: string;
}

interface CollectedSteps {
  ci: Record<string, CheckedStep[]>;
  release: Record<string, CheckedStep[]>;
}

interface ComposeInput {
  targets: string[];
  appDir?: string;
  prefix: string;
  systemSteps?: SystemStep[];
  steps?: CollectedSteps;
  app?: AppOfMany | null;
  baselines?: boolean;
  branch?: string;
}

interface ComposedWorkflows {
  ci: string;
  release: string;
  jobs: { ci: string[]; release: string[] };
}

declare const composeWorkflows: (input: ComposeInput) => ComposedWorkflows;
declare const workspaceCi: (systemSteps?: SystemStep[], branch?: string, steps?: CollectedSteps) => string;

export { composeWorkflows, workspaceCi };
export type { AppOfMany, CheckedStep, CollectedSteps, ComposeInput, ComposedWorkflows, SystemStep };
