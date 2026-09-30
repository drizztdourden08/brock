/* @layer tooling-scripts @kind types */
/**
 * @typedef {object} DoctorResult
 * @property {'ok' | 'missing' | 'skip'} status
 * @property {string} [detail] what was found, or why it was skipped
 * @property {string} [install] the command that installs it
 */

/**
 * @typedef {object} DoctorCheck
 * @property {string} label
 * @property {NodeJS.Platform[]} [hosts] runs only on these hosts
 * @property {(ctx: DoctorContext) => DoctorResult} run
 */

/**
 * @typedef {object} DoctorContext
 * @property {NodeJS.Platform} host
 * @property {NodeJS.ProcessEnv} env
 * @property {(command: string, args: string[]) => { ok: boolean, out: string }} probe
 * @property {{ manifest: Record<string, any> }[]} modules
 */

/**
 * @typedef {object} ScaffoldOutcome
 * @property {'done' | 'skipped' | 'pending' | 'failed'} status
 * @property {string} [detail]
 * @property {boolean} [install] package.json changed, pnpm install is due
 */

/**
 * @typedef {object} ScaffoldStep
 * @property {string} name
 * @property {'files' | 'tools'} phase files edit the tree, tools need the install
 * @property {(ctx: PlatformContext) => ScaffoldOutcome | Promise<ScaffoldOutcome>} run
 */

/**
 * @typedef {object} PlatformContext
 * @property {string} rootDir
 * @property {Record<string, any>} config the loaded brock.config.ts
 * @property {{ manifest: Record<string, any>, dir: string }[]} modules
 */

/**
 * @typedef {object} JobContext
 * @property {string} appDir the app folder, from the repo root
 * @property {string} prefix the release file prefix
 * @property {(os: string, opts?: { release?: boolean }) => string} setup
 */

/**
 * @typedef {object} Download
 * @property {string} glob artifact files, from the release job
 * @property {string} label
 * @property {boolean} [latest] link through releases/latest
 */

/**
 * @typedef {object} Job
 * @property {string} id
 * @property {string} text the job block, indented under jobs
 * @property {Download[]} [downloads]
 */

/**
 * @typedef {object} Secret
 * @property {string} name
 * @property {string} about
 */

/**
 * @typedef {object} PlatformSteps
 * @property {DoctorCheck[]} doctor
 * @property {ScaffoldStep[]} scaffold
 * @property {((ctx: JobContext) => Job) | null} ciJob
 * @property {((ctx: JobContext) => Job) | null} releaseJob
 * @property {((ctx: PlatformContext) => { path: string, content: string }[]) | null} managed
 */

/**
 * @typedef {object} PlatformInfo
 * @property {string} id
 * @property {string} label
 * @property {boolean} supported false for a reserved id
 * @property {Secret[]} secrets
 * @property {string | null} secretsHint how to make the secrets
 */

/** @typedef {PlatformSteps & PlatformInfo} Platform */

export {};
