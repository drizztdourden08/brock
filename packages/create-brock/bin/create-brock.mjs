/* @layer tooling-scripts @kind logic */
import { TESSERA_REGISTRY } from '../src/create-brock.constants.mjs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { defaultIdentity, identityProblem } from '../src/identity.mjs';
import { DEFAULT_TARGETS, targetInputProblem } from '@drizztdourden08/brock-build';
import { promptPlatforms } from '../src/platform-prompt.mjs';
import { promptIdentity } from '../src/prompts.mjs';
import { scaffold } from '../src/scaffold.mjs';

const USAGE = `Usage: create-brock <dir> [options]

Options:
  --name <text>          display name (default: from the folder name)
  --id <slug>            package id (default: the folder name as a slug)
  --app-id <reverse-dns> Windows AppUserModelId / electron-builder appId (default: com.example.<id>)
  --author-name <text>   (default: git config user.name)
  --author-email <text>  (default: git config user.email)
  --modules a,b          Brock module ids to install and record, beside the template's own
  --platforms a,b        platform ids and bundles for targets: windows, macos, linux, android, web,
                         desktop (windows, macos, linux), mobile (android; iOS once it lands).
                         Default desktop. Without it and without --yes, asked on the terminal
  --local <path>         Brock checkout; dependencies become link: specs into it
  --tessera <path|registry>  Tessera checkout, or registry for the published package (default: <local>/../tessera when present, else the registry)
  --yes                  accept the defaults, ask nothing
  --install              run pnpm install after scaffolding
  -h, --help
`;

const FLAG_KEYS = { name: 'name', id: 'id', 'app-id': 'appId', 'author-name': 'authorName', 'author-email': 'authorEmail' };

const OPTIONS = {
  name: { type: 'string' },
  id: { type: 'string' },
  'app-id': { type: 'string' },
  'author-name': { type: 'string' },
  'author-email': { type: 'string' },
  modules: { type: 'string' },
  platforms: { type: 'string' },
  local: { type: 'string' },
  tessera: { type: 'string' },
  yes: { type: 'boolean', default: false },
  install: { type: 'boolean', default: false },
  help: { type: 'boolean', short: 'h', default: false },
};

/**
 * @param {string} targetDir
 * @param {Record<string, string | boolean | undefined>} values
 * @returns {{ identity: import('../src/identity.mjs').Identity, missing: Set<string> }}
 */
const identityFromFlags = (targetDir, values) => {
  const identity = defaultIdentity(targetDir);
  const missing = new Set();
  for (const [flag, key] of Object.entries(FLAG_KEYS)) {
    if (values[flag] !== undefined) identity[key] = values[flag];
    else missing.add(key);
  }
  return { identity, missing };
};

const optionalPath = (value) => (value ? resolve(value) : null);

const listOf = (value) => (value ?? '').split(',').map((item) => item.trim()).filter(Boolean);

const chooseTargets = (values) => {
  if (values.platforms !== undefined) return Promise.resolve(listOf(values.platforms));
  return values.yes ? Promise.resolve(DEFAULT_TARGETS) : promptPlatforms(DEFAULT_TARGETS);
};

const main = async () => {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: OPTIONS });
  const [dir] = positionals;
  if (values.help || !dir) {
    console.log(USAGE);
    return dir ? 0 : 1;
  }
  const targetDir = resolve(dir);
  const { identity: fromFlags, missing } = identityFromFlags(targetDir, values);
  const identity = values.yes ? fromFlags : await promptIdentity(fromFlags, missing);
  const problem = identityProblem(identity);
  if (problem) {
    console.error(`create-brock: ${problem}`);
    return 1;
  }
  const modules = listOf(values.modules);
  const targets = await chooseTargets(values);
  const targetProblem = targetInputProblem(targets);
  if (targetProblem) {
    console.error(`create-brock: --platforms: ${targetProblem}`);
    return 1;
  }
  return scaffold({
    targetDir,
    identity,
    modules,
    targets,
    local: optionalPath(values.local),
    tessera: values.tessera === TESSERA_REGISTRY ? TESSERA_REGISTRY : optionalPath(values.tessera),
    install: values.install,
  });
};

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(`create-brock: ${error?.message ?? error}`);
    process.exit(1);
  },
);
