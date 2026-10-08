/* @layer tooling-scripts @kind types */
interface SystemStep {
  name: string;
  run: string;
  os?: 'windows' | 'linux' | 'macos';
}

interface ComposeInput {
  targets: string[];
  appDir?: string;
  prefix: string;
  systemSteps?: SystemStep[];
  baselines?: boolean;
}

interface ComposedWorkflows {
  ci: string;
  release: string;
  jobs: { ci: string[]; release: string[] };
}

declare const composeWorkflows: (input: ComposeInput) => ComposedWorkflows;

export { composeWorkflows };
export type { ComposeInput, ComposedWorkflows, SystemStep };
