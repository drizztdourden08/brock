/* @layer electron-main @kind logic */
import { spawnSync } from 'child_process';
import { SHELL_NOTIFY_SCRIPT, SHELL_NOTIFY_TIMEOUT_MS } from './os-integration.constants';

const notifyShell = (): void => {
  const encoded = Buffer.from(SHELL_NOTIFY_SCRIPT, 'utf16le').toString('base64');
  spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', encoded], {
    windowsHide: true, stdio: 'ignore', timeout: SHELL_NOTIFY_TIMEOUT_MS,
  });
};

export { notifyShell };
