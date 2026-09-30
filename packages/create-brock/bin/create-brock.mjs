/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { defaultIdentity, identityProblem } from '../src/identity.mjs';
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
  --local <path>         Brock checkout; dependencies become file: links into it
  --tessera <path>       Tessera checkout (default: <local>/../tessera when present, else the registry)
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
  const modules = (values.modules ?? '').split(',').map((m) => m.trim()).filter(Boolean);
  return scaffold({
    targetDir,
    identity,
    modules,
    local: optionalPath(values.local),
    tessera: optionalPath(values.tessera),
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
