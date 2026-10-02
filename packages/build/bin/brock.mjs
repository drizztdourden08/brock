/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { parseCli } from '../src/cli-args.mjs';
import { runAdd } from '../src/commands/add.mjs';
import { runAdopt } from '../src/commands/adopt.mjs';
import { runBuild } from '../src/commands/build.mjs';
import { runCheck } from '../src/commands/check.mjs';
import { runDev } from '../src/commands/dev.mjs';
import { runDoctorCommand } from '../src/commands/doctor.mjs';
import { runIcons } from '../src/commands/icons.mjs';
import { runMigrate } from '../src/commands/migrate.mjs';
import { runPackage } from '../src/commands/package.mjs';
import { runPlatform } from '../src/commands/platform.mjs';
import { runStart } from '../src/commands/start.mjs';
import { runProse } from '../src/commands/prose.mjs';
import { runStructure } from '../src/commands/structure.mjs';
import { runSync } from '../src/commands/sync.mjs';
import { runWeb } from '../src/commands/web.mjs';
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
                             the update package and a delta when the previous release was downloaded there.
                             On Windows it also builds the small installer (<prefix>windows-setup.exe, needs the
                             Visual Studio C++ tools) and install.json; --full adds the payload it fetches
                             (<prefix>windows-payload.exe, with the app icon, the Setup splash and the accent) and
                             <prefix>windows-directory.zip. macOS stops after electron-builder (dmg, zip).
                             Needs vpk: dotnet tool install -g vpk --version <the app's velopack version>
  brock package --render-installer
                             Windows: build the installer stub and write its screens, the mark and the Setup
                             splash as PNGs into release/installer-preview; installs nothing, packs nothing
  brock icons [--force]      copy the Tessera brand set (icons.brand) into build/icons, build/splash and public/logos
                             (skips a file newer than its source; --force copies all)
  brock start [args]         run dist/electron/main.js with Electron; unknown options reach the app
                             (pnpm start --user-data=x works with or without the --)
  brock adopt [--scope @x] [--local <brockRepo>] [--force]
                             give any repo the lint configs, pnpm files and the lint-config dependency,
                             plus its own command: bin/<name>.mjs, linked by the postinstall
  brock structure [--check] [--scope @x]
                             verify the folder standard: package names, barrels, folder names, depth
  brock migrate --from <version> [--to <version>] [--report <file>]
                             run the Brock migrations after --from, up to --to (open when left off), over the
                             files the app owns; --report writes the touched files and numbered to-dos as JSON
  brock prose                run the writing gate over every tracked text file the other linters skip
                             (json, yaml, toml, html, svg, txt, config files)
  brock platform list | add <id | bundle>... | remove <id | bundle>...
                             the platforms in brock.config.ts targets: windows, macos, linux, android, web
                             (ios is reserved), bundles desktop and mobile. add runs each platform's scaffold
                             steps and doctor; add and remove rewrite targets and regenerate both workflows
  brock doctor [id | bundle...]
                             check this machine for what the targets need (Node, pnpm, .NET and vpk, MSVC,
                             JDK 21, the Android SDK, module libraries); prints install commands, installs nothing
  brock web build | dev      the renderer alone with a relative base into dist/web, from vite.web.config.ts
  brock tessera <args...>    Tessera's own command line (new, ...), run in the current folder so it finds
                             tessera.config.json from there; every word after tessera reaches it, --help too

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
  brock mobile build [--release] [--out <file>]
                             web build, cap sync, gradle assembleDebug (or a signed assembleRelease)
  brock mobile keystore      make the release keystore with keytool (asks), print the gh secret set lines
  brock release [version] [--latest | --prerelease] [--full]
                             run .github/workflows/release.yml for v<version>, notes from
                             release-notes/v<version>.md (asks)
  brock upgrade [version] [--check] [--no-review] [--local <brockRepo>]
                             move the app to a Brock release in the worktree brock-<version>, prove it with
                             the gate and the review, commit when green; --check exits 0 current, 1 behind,
                             2 registry unreachable
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
  migrate: (ctx) => runMigrate(ctx),
  platform: (ctx) => runPlatform(ctx),
  doctor: (ctx) => runDoctorCommand(ctx),
  web: (ctx) => runWeb(ctx),
};

const runTesseraWords = async (args) => {
  const { runTesseraCommand } = await import('../src/commands/tessera.mjs');
  return runTesseraCommand({ args, cwd: process.cwd() });
};

const main = async () => {
  if (process.argv[2] === 'tessera') return runTesseraWords(process.argv.slice(3));
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
  return run({ rootDir, input, args: positionals.slice(1), check: values.check, scope: values.scope, local: values.local, force: values.force, full: values.full, channel: values.channel, renderInstaller: values['render-installer'], from: values.from, to: values.to, report: values.report, passthrough });
};

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(`brock: ${error?.message ?? error}`);
    process.exit(1);
  },
);
