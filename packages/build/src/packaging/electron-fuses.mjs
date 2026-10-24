/* @layer tooling-scripts @kind logic */

const FUSES_LABEL = 'brock.config.ts fuses.';

/**
 * @param {{ runAsNode?: boolean } | undefined} fuses fuses of brock.config.ts
 * @param {Record<string, string> | undefined} helpers helpers of brock.config.ts
 * @returns {boolean} on with helpers, off without, unless the app says
 */
const runAsNodeOf = (fuses, helpers) => {
  const helperDeclared = Object.keys(helpers ?? {}).length > 0;
  if (fuses?.runAsNode === false && helperDeclared) {
    throw new Error(`${FUSES_LABEL}runAsNode is false, but helpers are declared: a helper starts through ELECTRON_RUN_AS_NODE. Drop one of the two.`);
  }
  return fuses?.runAsNode ?? helperDeclared;
};

/**
 * @param {{ platform?: string, helpers?: Record<string, string>, fuses?: { runAsNode?: boolean } }} app platform: the platform of the build, default the host
 * @returns {Record<string, boolean>} the electronFuses of the electron-builder config
 */
const electronFusesOf = ({ platform = process.platform, helpers, fuses }) => ({
  runAsNode: runAsNodeOf(fuses, helpers),
  enableNodeOptionsEnvironmentVariable: false,
  enableNodeCliInspectArguments: false,
  onlyLoadAppFromAsar: true,
  enableEmbeddedAsarIntegrityValidation: platform !== 'linux',
  enableCookieEncryption: true,
});

export { electronFusesOf };
