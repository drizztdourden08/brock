/* @layer electron-main @kind constants */
const AUTOSTART_SEQUENCES: readonly (readonly string[])[] = [
  ['start menu', 'programs', 'startup'],
  ['library', 'launchagents'],
  ['library', 'launchdaemons'],
  ['.config', 'autostart'],
  ['.config', 'systemd'],
  ['.config', 'fish'],
  ['.ssh'],
];

const SHELL_PROFILE_FILES: ReadonlySet<string> = new Set([
  '.bashrc', '.bash_profile', '.bash_login', '.bash_logout', '.zshrc', '.zshenv', '.zprofile', '.zlogin', '.zlogout',
  '.profile', '.kshrc', '.cshrc', '.tcshrc', '.login', '.envrc',
]);

const POWERSHELL_FOLDERS: ReadonlySet<string> = new Set(['windowspowershell', 'powershell']);

const POWERSHELL_PROFILE = /profile.*\.ps1$/;

export { AUTOSTART_SEQUENCES, POWERSHELL_FOLDERS, POWERSHELL_PROFILE, SHELL_PROFILE_FILES };
