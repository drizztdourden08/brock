/* @layer tooling-scripts @kind constants */
import { OWN_PACKAGE } from './modules/sync.mjs';

const USAGE = `brock ${OWN_PACKAGE.version}

Usage:
  brock sync [--check | --if-stale]
                             regenerate the managed files, or report drift with --check; --if-stale syncs only
                             when .brock is missing or older than its inputs, then checks the renderer entry
  brock check                sync --check, for CI
  brock gate                 the app's own gate steps from brock.config.ts gate: the clang-format check of
                             gate.clangFormat, then each gate.scripts script; CI and upgrade run it too
  brock clang-format [--check]
                             rewrite the C sources of gate.clangFormat to the managed .clang-format, or list
                             the files that differ with --check
  brock add <id | spec> [--local <brockRepo>]
                             install a module package (or link it from a Brock checkout), record its id, sync
  brock dev [args]           electron-vite dev; unknown options and anything after -- reach it; syncs first
                             when .brock is missing or stale, and stops when the renderer entry misses a file
  brock build [--if-stale] [args]
                             electron-vite build; syncs first like dev, copies the brand icon set when icons.brand is set;
                             --if-stale builds only when dist is missing, half built or older than the app's sources
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
  brock migrate --run <id> [--report <file>]
                             run one Brock migration by id, at any version, without the Tessera replay
  brock migrate --from <version> [--to <version>] [--tessera-from <version>] [--report <file>]
  brock migrate --tessera-from-copy <folder> --map <file> [--alias <alias>]... [--report <file>]
                             run the Brock migrations after --from, up to --to (open when left off), over the
                             files the app owns, then replay Tessera's RENAMES.json from --tessera-from (else
                             package.json brock.tessera, else 0.3.0) to the installed Tessera, its next release
                             too when Tessera is linked to main, and pin brock.tessera; --tessera-from alone
                             replays only the renames. --report writes the touched files and numbered to-dos as JSON
                             to <file>, relative to the current directory (not --root), and prints the path.
                             An app with no brock.version is refused: run brock adopt first.
                             --tessera-from-copy converts an app that holds its own copy of the design system
                             (<folder>, from --root, imported through each --alias and relative paths): its imports
                             name the Tessera entry points the --map JSON gives each folder (relative to the current
                             directory), then every release after the map's "from" replays over them
  brock release-notes check [version]
                             the release note of that version (else the app's own once the repo has notes):
                             release-notes/v<version>.md at the repo root, its title, summary, sections and
                             plain-English bullets; the release workflow runs it before it tags
  brock affected <app folder> [base ref]
                             true when the changes since the merge base with the ref touch the app: its own
                             files, a workspace package it depends on, or a file outside every package (CI)
  brock prose                run the writing gate over every tracked text file the other linters skip
                             (json, yaml, toml, html, svg, txt, config files)
  brock knip [args]          knip with every git-ignored path under ignore, so it also works in a worktree
                             inside a dot-folder; a dependency an app declares for the Brock and workspace
                             packages it bundles counts as used, built or not; every word after knip reaches it
  brock platform list | add <id | bundle>... | remove <id | bundle>...
                             the platforms in brock.config.ts targets: windows, macos, linux, android, web, server
                             (ios is reserved), bundles desktop and mobile. add runs each platform's scaffold
                             steps and doctor; add and remove rewrite targets and regenerate both workflows
  brock doctor [id | bundle...]
                             check this machine for what the targets need (Node, pnpm, .NET and vpk, MSVC,
                             JDK 21, the Android SDK, module libraries); prints install commands, installs nothing
  brock web build | dev      the renderer alone with a relative base into dist/web, from vite.web.config.ts
  brock server build | dev   the server entry (server.entry, default server/main.ts) as one Node file with every
                             dependency inlined, dist/server/main.mjs; dev rebuilds on change and restarts it with
                             node --watch; anything after -- reaches the app. A native .node addon is refused
  brock server package [--arch x64,arm64] [--deb]
                             build, then fill release/server: <prefix>server-linux-<arch>.tar.gz with a pinned
                             Node binary (sha256 checked against nodejs.org), a docker/ build context, and with
                             --deb a <prefix>server_<version>_<arch>.deb (needs dpkg-deb, so Linux). The arches
                             default to server.arch, then x64. A server-only app runs this as brock package
  brock site add <name> [--brand <brand>] [--api <url | port offset>]
                             add a web app at apps/<name>: a Vite single-page app on Tessera (TesseraProvider, the
                             brand palette, tokens, theme.css), Vite dev on a tool port of the app's block, its
                             build into dist, lint and structure coverage, its own ci-<name>.yml, and a dev
                             proxy for /api to a URL or a port offset; no server, functions, hosting or auth
  brock site dev | build | preview [args]
                             in a site folder: Vite on its port with the /api proxy, the build, or a preview
  brock site list            the sites of the repo, their ports and their /api target
  brock tessera <args...>    Tessera's own command line (new, ...), run in the current folder so it finds
                             tessera.config.json from there; every word after tessera reaches it, --help too

Thread lifecycle (brock.workspace.mjs, one worktree per thread):
  brock worktree create <name> [--from <ref>] [--base <branch>]
  brock worktree launch <name> <state|none> [--target <key>] [--prod] [--visible [--sound]] [passthrough...]
  brock worktree refresh <name> [--reset] [--rebase [ref]]
  brock worktree commit [name] --message "<text>" | --message-file <path>
  brock worktree finish [name] | remove <name>
  brock worktree base [name] [<new base>]
                             the branch the thread starts from, rebases on, opens its PR into and lands on
  brock launch <name> <state|none> [...]
                             same as worktree launch; hidden (no window shown) and muted unless --visible
  brock pr push | open | status [name]
                             push and open ask: work leaves the machine
  brock mobile push          web build, cap sync, gradle, adb install and start
  brock mobile build [--release] [--out <file>]
                             web build, cap sync, gradle assembleDebug (or a signed assembleRelease)
  brock mobile keystore      make the release keystore with keytool (asks), print the gh secret set lines
  brock linux push [--build-only]
                             build the Linux AppImage in the VirtualBox VM (or in WSL), install its desktop
                             entry and launch it there, over key-only SSH; settings per machine in
                             ~/.brock/linux/<repo>.json, never a password
  brock linux doctor | init  check WSL, VirtualBox, the VM and SSH access; write the machine settings file
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
  --app <dir>                the app for dev, build, package, icons, start, add, platform, web and server
                             in a workspace with several apps. Without it these commands use the nearest
                             folder above the current one that holds brock.config.ts, or the workspace's only app.
  -h, --help
  -v, --version
`;

export { USAGE };
