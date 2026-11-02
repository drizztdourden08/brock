/* @layer tooling-scripts @kind constants */
// pnpm asks before it purges a node_modules folder it cannot reuse, and with no terminal that ask aborts the install
// (ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY). The CLI never has a terminal to answer, so it answers no to the ask.
const NO_PURGE_PROMPT = '--config.confirmModulesPurge=false';

export { NO_PURGE_PROMPT };
