/* @layer tooling-scripts @kind constants */

/** Content-keyed records: each one checks its own inputs when it is read, so they are copied whatever the tree. */
const KEYED_ARTEFACTS = ['node_modules/.vite/brock-build-reuse'];

/** Ignored outputs Brock and Tessera generate in an app folder, trusted only when the app's tracked tree matches. */
const APP_ARTEFACTS = ['dist', 'guide', '.brock', 'src/guide', 'build/icons', 'build/filetypes', 'build/splash', 'build/installer-splash.png', 'public/logos'];

/** The same, at the workspace root. */
const ROOT_ARTEFACTS = ['guide'];

export { APP_ARTEFACTS, KEYED_ARTEFACTS, ROOT_ARTEFACTS };
