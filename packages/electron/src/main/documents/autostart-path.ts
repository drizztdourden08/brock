/* @layer electron-main @kind logic */
import { AUTOSTART_SEQUENCES, POWERSHELL_FOLDERS, POWERSHELL_PROFILE, SHELL_PROFILE_FILES } from './autostart-paths.constants';
import { hasSequence } from './has-sequence';
import { pathSegments } from './path-segments';

const powershellCode = (segments: string[]): boolean => {
  const at = segments.findIndex((segment) => POWERSHELL_FOLDERS.has(segment));
  return at >= 0 && (segments.slice(at + 1).includes('modules') || POWERSHELL_PROFILE.test(segments[segments.length - 1] ?? ''));
};

const autostartPath = (path: string): boolean => {
  const segments = pathSegments(path);
  return AUTOSTART_SEQUENCES.some((sequence) => hasSequence(segments, sequence))
    || SHELL_PROFILE_FILES.has(segments[segments.length - 1] ?? '')
    || powershellCode(segments);
};

export { autostartPath };
