/* @layer tooling-scripts @kind constants */
const CI_WORKFLOW_FILE = '.github/workflows/ci.yml';
const RELEASE_WORKFLOW_FILE = '.github/workflows/release.yml';

const RELEASE_DIR = import.meta.dirname;

const SET_VERSION_SCRIPT = String.raw`node -e "const f=process.argv[1];const p=JSON.parse(require('fs').readFileSync(f,'utf8'));p.version=process.argv[2];require('fs').writeFileSync(f,JSON.stringify(p,null,2)+'\n')"`;

const SET_VERSION = `${SET_VERSION_SCRIPT} "$APP_DIR/package.json" "\${{ needs.prepare.outputs.version }}"`;

const CHECKOUT_RELEASE = [
  '',
  '        with:',
  '          ref: ${{ needs.prepare.outputs.sha }}',
  '',
  '      # The tag and the version commit wait for every build: the release job makes them.',
  '      - name: Set the release version',
  '        shell: bash',
  `        run: ${SET_VERSION}`,
].join('\n');

const CHECKOUT_HISTORY = '\n        with:\n          fetch-depth: 0';

const HOST_OS = Object.freeze({ 'ubuntu-latest': 'linux', 'windows-latest': 'windows', 'macos-latest': 'macos' });

const WORKFLOWS_DIR = '.github/workflows';

const DEFAULT_BRANCH = 'main';

const GITHUB_EXCEPTION = '!.github/';

const GITHUB_IGNORES = new Set(['.*/', '.*', '/.*/', '/.*', '.github', '.github/', '/.github', '/.github/', '**/.github', '**/.github/']);

const GITHUB_UNIGNORES = new Set([GITHUB_EXCEPTION, '!.github', '!/.github/', '!/.github']);

export {
  CI_WORKFLOW_FILE, RELEASE_WORKFLOW_FILE, RELEASE_DIR, CHECKOUT_RELEASE, SET_VERSION, CHECKOUT_HISTORY, HOST_OS, WORKFLOWS_DIR, DEFAULT_BRANCH,
  GITHUB_EXCEPTION, GITHUB_IGNORES, GITHUB_UNIGNORES,
};
