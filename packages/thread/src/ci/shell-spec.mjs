/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const GIT_BASH_DEFAULT = 'C:\\Program Files\\Git\\bin\\bash.exe';
const PWSH_PREAMBLE = "$ErrorActionPreference = 'stop'";
const PWSH_EPILOGUE = 'if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }';

let gitBashPath;

const gitPaths = () => {
  try {
    return execFileSync('where', ['git'], { windowsHide: true, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
};

/**
 * @returns {string | null} Git for Windows' bash.exe, null when it is missing
 */
const gitBash = () => {
  if (gitBashPath === undefined) {
    const beside = gitPaths().flatMap((path) => [join(dirname(path), '..', 'bin', 'bash.exe'), join(dirname(path), '..', '..', 'bin', 'bash.exe')]);
    gitBashPath = [...beside, GIT_BASH_DEFAULT].find((path) => existsSync(path)) ?? null;
  }
  return gitBashPath;
};

const forward = (path) => path.replace(/\\/g, '/');

const BUILT_IN = {
  bash: { ext: 'sh', args: (file) => ['--noprofile', '--norc', '-eo', 'pipefail', file], wrap: (script) => script },
  sh: { ext: 'sh', args: (file) => ['-e', file], wrap: (script) => script },
  pwsh: { ext: 'ps1', args: (file) => ['-NoProfile', '-NonInteractive', '-Command', `. '${file}'`], wrap: (script) => `${PWSH_PREAMBLE}\n${script}\n${PWSH_EPILOGUE}` },
  powershell: { ext: 'ps1', args: (file) => ['-NoProfile', '-NonInteractive', '-Command', `. '${file}'`], wrap: (script) => `${PWSH_PREAMBLE}\n${script}\n${PWSH_EPILOGUE}`, windowsOnly: true },
  cmd: { ext: 'cmd', args: (file) => ['/D', '/E:ON', '/V:OFF', '/S', '/C', `"CALL "${file}""`], wrap: (script) => script, windowsOnly: true, verbatim: true },
};

const fileOf = (name, platform) => {
  if (name === 'cmd') return process.env.ComSpec ?? 'cmd.exe';
  if (name === 'bash' && platform === 'win32') return gitBash();
  return name;
};

const customArgs = (tokens) => (file) => tokens.slice(1).map((token) => token.replace('{0}', file));

/**
 * @param {string} shell the `shell:` of a step: a name (bash, sh, pwsh, powershell, cmd) or a name with a {0} template such as `bash -e {0}`
 * @param {string} [platform] the Node platform of this machine
 * @returns {{ file: string, ext: string, args: (script: string) => string[], wrap: (script: string) => string, verbatim: boolean } | { unavailable: string }} how to run a script in that shell here
 */
const shellSpec = (shell, platform = process.platform) => {
  const tokens = shell.trim().split(/\s+/);
  const base = BUILT_IN[tokens[0]];
  if (!base) return { unavailable: `The shell "${shell}" is not one the local runner supports (bash, sh, pwsh, powershell, cmd).` };
  if (base.windowsOnly && platform !== 'win32') return { unavailable: `The shell "${tokens[0]}" exists only on Windows.` };
  const file = fileOf(tokens[0], platform);
  if (!file) return { unavailable: 'Git Bash was not found, so a bash step cannot run on this machine.' };
  const args = tokens.length > 1 ? customArgs(tokens) : base.args;
  const place = tokens[0] === 'bash' || tokens[0] === 'sh' ? forward : (path) => path;
  return { file, ext: base.ext, args: (script) => args(place(script)), wrap: base.wrap, verbatim: base.verbatim === true };
};

export { shellSpec };
