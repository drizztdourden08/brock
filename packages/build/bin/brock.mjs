/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { parseCli } from '../src/cli-args.mjs';
import { runAdd } from '../src/commands/add.mjs';
import { runAdopt } from '../src/commands/adopt.mjs';
import { runBuild } from '../src/commands/build.mjs';
import { runCheck } from '../src/commands/check.mjs';
import { runDev } from '../src/commands/dev.mjs';
import { runIcons } from '../src/commands/icons.mjs';
import { runPackage } from '../src/commands/package.mjs';
import { runStart } from '../src/commands/start.mjs';
import { runProse } from '../src/commands/prose.mjs';
import { runStructure } from '../src/commands/structure.mjs';
import { runSync } from '../src/commands/sync.mjs';
import { OWN_PACKAGE } from '../src/modules/sync.mjs';
import { runThread, threadVerbNames } from '@drizztdourden08/brock-thread/cli';

const USAGE = `brock ${OWN_PACKAGE.version}

Usage:
  brock sync [--check]       regenerate the managed files, or report drift with --check
  brock check                sync --check, for CI
  brock add <id | spec> [--local <brockRepo>]
                             install a module package (or link it from a Brock checkout), record its id, sync
  brock dev [args]           electron-vite dev; unknown options and anything after -- reach it
  brock build [args]         electron-vite build; copies the brand icon set first when icons.brand is set
  brock package [--full] [--channel <name>]
                             build, then electron-builder --dir for this OS, then vpk pack into release/velopack:
                             the update package, a delta when the previous release was downloaded there,
                             and on Windows the installer (Setup.exe with the app icon and a splash from the brand
                             icon); --full adds the portable zip. macOS stops after electron-builder (dmg, zip).
                             Needs vpk: dotnet tool install -g vpk --version <the app's velopack version>
  brock icons [--force]      copy the Tessera brand set (icons.brand) into build/icons, build/splash and public/logos
                             (skips a file newer than its source; --force copies all)
  brock start [args]         run dist/electron/main.js with Electron; unknown options reach the app
                             (pnpm start --user-data=x works with or without the --)
  brock adopt [--scope @x] [--local <brockRepo>] [--force]
                             give any repo the lint configs, pnpm files and the lint-config dependency,
                             plus its own command: bin/<name>.mjs, linked by the postinstall
  brock structure [--check] [--scope @x]
                             verify the folder standard: package names, barrels, folder names, depth
  brock prose                run the writing gate over every tracked text file the other linters skip
                             (json, yaml, toml, html, svg, txt, config files)

Thread lifecycle (brock.workspace.mjs, one worktree per thread):
  brock worktree create <name> [--from <ref>]
  brock worktree launch <name> <state|none> [--target <key>] [--prod] [--visible [--sound]] [passthrough...]
  brock worktree refresh <name> [--reset] [--rebase [ref]]
  brock worktree commit [name] --message "<text>" | --message-file <path>
  brock worktree finish [name] | remove <name>
  brock launch <name> <state|none> [...]
                             same as worktree launch; headless and muted unless --visible
  brock pr push | open | status [name]
                             push and open ask: work leaves the machine
  brock mobile push          web build, cap sync, gradle, adb install and start
  brock release [version] [--latest | --prerelease] [--full]
                             run .github/workflows/release.yml for v<version>, notes from
                             release-notes/v<version>.md (asks)
  A plugin verb (definePlugin) is reached the same way: brock <verb> [...]
  In a repo, run all of this through the repo's own command (bin/<name>.mjs, written by adopt).

Options:
  --root <dir>               repo or app root (default: the current directory)
  -h, --help
  -v, --version
`;

const COMMANDS = {
  sync: (ctx) => runSync(ctx),
  check: (ctx) => runCheck(ctx),
  add: (ctx) => runAdd(ctx),
  dev: (ctx) => runDev(ctx),
  build: (ctx) => runBuild(ctx),
  package: (ctx) => runPackage(ctx),
  icons: (ctx) => runIcons(ctx),
  start: (ctx) => runStart(ctx),
  adopt: (ctx) => runAdopt(ctx),
  structure: (ctx) => runStructure(ctx),
  prose: (ctx) => runProse(ctx),
};

const main = async () => {
  const { values, positionals, passthrough } = parseCli(process.argv.slice(2));
  if (values.version) {
    console.log(OWN_PACKAGE.version);
    return 0;
  }
  const [command, input] = positionals;
  if (values.help || !command) {
    console.log(USAGE);
    return command ? 0 : 1;
  }
  const run = COMMANDS[command];
  if (!run || threadVerbNames().includes(command)) return runThread(process.argv.slice(2));
  const rootDir = resolve(values.root ?? process.cwd());
  return run({ rootDir, input, check: values.check, scope: values.scope, local: values.local, force: values.force, full: values.full, channel: values.channel, passthrough });
};

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(`brock: ${error?.message ?? error}`);
    process.exit(1);
  },
);
