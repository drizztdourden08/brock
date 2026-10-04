/* @layer tooling-scripts @kind types */
/**
 * @typedef {object} BrockInstall
 * @property {'registry' | 'link' | 'workspace' | 'none'} mode
 * @property {string | null} pinned brock.version, else the installed build
 * @property {string | null} checkout the linked Brock checkout
 */

/**
 * @typedef {object} UpgradePlan
 * @property {'registry' | 'link'} mode
 * @property {string | null} current
 * @property {string} target
 * @property {string | null} checkout the Brock checkout in link mode
 * @property {boolean} relink true when --local switches to links
 */

/**
 * @typedef {object} UpgradeApp
 * @property {string} dir the app folder, absolute
 * @property {string} label the app folder relative to the repo root, `.` for a root app
 * @property {string | null} from the app's brock.version before the bump, else the plan's
 * @property {string | null} tesseraFrom for --tessera-from
 */

/**
 * @typedef {object} StepResult
 * @property {string} name
 * @property {'passed' | 'failed' | 'skipped'} status
 * @property {string} [detail]
 */

/**
 * @typedef {object} MigrationTodo
 * @property {number} number
 * @property {string} migration
 * @property {string} file
 * @property {number | null} line
 * @property {string} message
 */

/**
 * @typedef {object} MigrationRun
 * @property {{ id: string, version: string, source: string, summary: string, touched: string[] }[]} applied
 * @property {MigrationTodo[]} todos
 */

export {};
