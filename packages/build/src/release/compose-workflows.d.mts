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

interface ComposeInput {
  targets: string[];
  appDir?: string;
  prefix: string;
  systemSteps?: SystemStep[];
  app?: AppOfMany | null;
}

interface ComposedWorkflows {
  ci: string;
  release: string;
  jobs: { ci: string[]; release: string[] };
}

declare const composeWorkflows: (input: ComposeInput) => ComposedWorkflows;
declare const workspaceCi: (systemSteps?: SystemStep[]) => string;

export { composeWorkflows, workspaceCi };
export type { AppOfMany, ComposeInput, ComposedWorkflows, SystemStep };
