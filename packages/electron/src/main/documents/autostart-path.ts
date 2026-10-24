/* @layer electron-main @kind logic */
import { AUTOSTART_SEQUENCES, POWERSHELL_FOLDERS, POWERSHELL_PROFILE, SHELL_PROFILE_FILES } from './autostart-paths.constants';

const hasSequence = (segments: string[], sequence: readonly string[]): boolean =>
  segments.some((_segment, index) => sequence.every((name, offset) => segments[index + offset] === name));

const powershellCode = (segments: string[]): boolean => {
  const at = segments.findIndex((segment) => POWERSHELL_FOLDERS.has(segment));
  return at >= 0 && (segments.slice(at + 1).includes('modules') || POWERSHELL_PROFILE.test(segments[segments.length - 1] ?? ''));
};

const autostartPath = (path: string): boolean => {
  const segments = path.toLowerCase().split(/[\\/]/).filter((segment) => segment !== '');
  return AUTOSTART_SEQUENCES.some((sequence) => hasSequence(segments, sequence))
    || SHELL_PROFILE_FILES.has(segments[segments.length - 1] ?? '')
    || powershellCode(segments);
};

export { autostartPath };
