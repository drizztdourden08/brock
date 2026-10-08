/* @layer tooling-scripts @kind constants */
const CI_WORKFLOW_FILE = '.github/workflows/ci.yml';
const RELEASE_WORKFLOW_FILE = '.github/workflows/release.yml';

const RELEASE_DIR = import.meta.dirname;

const CHECKOUT_TAG = '\n        with:\n          ref: ${{ needs.prepare.outputs.tag }}';

const CHECKOUT_HISTORY = '\n        with:\n          fetch-depth: 0';

const HOST_OS = Object.freeze({ 'ubuntu-latest': 'linux', 'windows-latest': 'windows', 'macos-latest': 'macos' });

const WORKFLOWS_DIR = '.github/workflows';

export { CI_WORKFLOW_FILE, RELEASE_WORKFLOW_FILE, RELEASE_DIR, CHECKOUT_TAG, CHECKOUT_HISTORY, HOST_OS, WORKFLOWS_DIR };
