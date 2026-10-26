/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { parseCli } from '../src/cli-args.mjs';
import { runAdd } from '../src/commands/add.mjs';
import { runAffected } from '../src/commands/affected.mjs';
import { runAdopt } from '../src/commands/adopt.mjs';
import { runBuild } from '../src/commands/build.mjs';
import { runCheck } from '../src/commands/check.mjs';
import { runClangFormatCommand } from '../src/commands/clang-format.mjs';
import { runGateCommand } from '../src/commands/gate.mjs';
import { runDev } from '../src/commands/dev.mjs';
import { runDoctorCommand } from '../src/commands/doctor.mjs';
import { runIcons } from '../src/commands/icons.mjs';
import { runLint } from '../src/commands/lint.mjs';
import { runMigrate } from '../src/commands/migrate.mjs';
import { runPackage } from '../src/commands/package.mjs';
import { runPlatform } from '../src/commands/platform.mjs';
import { runReleaseNotes } from '../src/commands/release-notes.mjs';
import { runStart } from '../src/commands/start.mjs';
import { runProse } from '../src/commands/prose.mjs';
import { runStructure } from '../src/commands/structure.mjs';
import { runSync } from '../src/commands/sync.mjs';
import { runServer } from '../src/commands/server.mjs';
import { runWeb } from '../src/commands/web.mjs';
import { runSite } from '../src/commands/site.mjs';
import { resolveAppDir } from '../src/resolve-app-dir.mjs';
import { OWN_PACKAGE } from '../src/modules/sync.mjs';
import { USAGE } from '../src/cli-usage.mjs';
import { runThread, threadVerbNames } from '@drizztdourden08/brock-thread/cli';

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
  lint: (ctx) => runLint(ctx),
  migrate: (ctx) => runMigrate(ctx),
  platform: (ctx) => runPlatform(ctx),
  doctor: (ctx) => runDoctorCommand(ctx),
  web: (ctx) => runWeb(ctx),
  server: (ctx) => runServer(ctx),
  site: (ctx) => runSite(ctx),
  'release-notes': (ctx) => runReleaseNotes(ctx),
  affected: (ctx) => runAffected(ctx),
  gate: (ctx) => runGateCommand(ctx),
  'clang-format': (ctx) => runClangFormatCommand(ctx),
};

const APP_COMMANDS = new Set(['dev', 'build', 'package', 'icons', 'start', 'add', 'platform', 'web', 'server']);

const rootDirOf = async (command, values) => {
  const start = resolve(values.root ?? process.cwd());
  if (!APP_COMMANDS.has(command)) return start;
  const appDir = await resolveAppDir(start, values.app);
  if (appDir !== process.cwd()) process.chdir(appDir);
  return appDir;
};

const runTesseraWords = async (args) => {
  const { runTesseraCommand } = await import('../src/commands/tessera.mjs');
  return runTesseraCommand({ args, cwd: process.cwd() });
};

const runKnipWords = async (args) => {
  const { runKnip } = await import('../src/commands/knip.mjs');
  return runKnip({ rootDir: process.cwd(), args });
};

const main = async () => {
  if (process.argv[2] === 'tessera') return runTesseraWords(process.argv.slice(3));
  if (process.argv[2] === 'knip') return runKnipWords(process.argv.slice(3));
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
  const rootDir = await rootDirOf(command, values);
  return run({ rootDir, input, args: positionals.slice(1), check: values.check, ifStale: values['if-stale'], scope: values.scope, local: values.local, force: values.force, all: values.all, changed: values.changed, noCache: values['no-cache'], full: values.full, arch: values.arch, deb: values.deb, channel: values.channel, renderInstaller: values['render-installer'], from: values.from, to: values.to, run: values.run, tesseraFrom: values['tessera-from'], tesseraFromCopy: values['tessera-from-copy'], aliases: values.alias, map: values.map, report: values.report, brand: values.brand, api: values.api, passthrough });
};

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(`brock: ${error?.message ?? error}`);
    process.exit(1);
  },
);
