/* @layer tooling-scripts @kind types */
/**
 * @typedef {object} WorktreeContext
 * @property {string} name
 * @property {string} path the worktree directory
 * @property {string} main the main checkout
 * @property {string} userData `<path>/.user-data`
 * @property {Workspace} workspace
 * @property {(message: string) => void} log
 * @property {Record<string, string | boolean>} [options] the verb's options
 */

/**
 * @typedef {object} LaunchRequest
 * @property {WorktreeContext} worktree
 * @property {string} state the launch positional: `none`, a name, a number
 * @property {boolean} visible
 * @property {boolean} sound
 * @property {boolean} prod
 * @property {string[]} passthrough flags the app receives untouched
 */

/**
 * @typedef {object} LaunchTarget
 * @property {'electron' | 'serve'} kind
 * @property {(request: LaunchRequest) => Promise<import('node:child_process').ChildProcess>} launch
 * @property {(worktree: WorktreeContext, prod: boolean) => string | null} [notReady] a message when a launch cannot start
 * @property {(worktree: WorktreeContext, state: string) => string | null} [checkState] a message when the state does not exist
 */

/**
 * @typedef {object} ProvisionStep
 * @property {string} name
 * @property {(worktree: WorktreeContext) => Promise<void> | void} run
 * @property {(worktree: WorktreeContext) => Promise<void> | void} [afterLaunch] runs when a launched app quits
 */

/**
 * @typedef {object} BuildStep
 * @property {string} name
 * @property {(worktree: WorktreeContext) => boolean} isStale
 * @property {(worktree: WorktreeContext) => Promise<void> | void} run
 */

/**
 * @typedef {object} Verb
 * @property {(positional: string[], options: Record<string, string | boolean>, ctx: ThreadContext) => Promise<number | void>} run
 * @property {string} usage one line per sub-verb
 * @property {boolean} [asks] publishes or destroys; stays behind a permission prompt
 */

/**
 * @typedef {object} GuardRule
 * @property {string} name
 * @property {(command: string, ctx: ThreadContext) => { verdict: 'deny' | 'ask' | 'pass', reason?: string }} check
 */

/**
 * @typedef {object} Plugin
 * @property {string} name
 * @property {Record<string, Verb>} verbs
 * @property {Record<string, LaunchTarget>} targets
 * @property {{ provision: ProvisionStep[], build: BuildStep[] }} steps
 * @property {GuardRule[]} guards
 */

/**
 * @typedef {object} WorkspaceGit
 * @property {string} base `master` or `main`
 * @property {string} branchPrefix `agent/`
 * @property {string[]} protectedBranches
 * @property {string} worktreesDir relative to the main checkout, `.worktrees`
 * @property {{ prStyle: 'house' | 'none' }} publish
 */

/**
 * @typedef {object} WorkspaceSlots
 * @property {string} name the alias and the instance prefix
 * @property {Record<string, LaunchTarget>} targets the first is the default
 * @property {ProvisionStep[]} provision
 * @property {{ staleDirs: string[], steps: BuildStep[] }} build
 * @property {(string | Plugin)[]} plugins
 */

/** @typedef {WorkspaceGit & WorkspaceSlots} Workspace */

/**
 * @typedef {object} ThreadRegistry
 * @property {Record<string, Verb>} verbs every plugin verb
 * @property {Record<string, LaunchTarget>} targets
 * @property {ProvisionStep[]} provision
 * @property {BuildStep[]} build
 * @property {GuardRule[]} guards
 */

/**
 * @typedef {ThreadRegistry & { rootDir: string, workspace: Workspace, plugins: Plugin[], log: (message: string) => void }} ThreadContext
 */

export {};
