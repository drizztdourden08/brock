/* @layer electron-main @kind logic */
import { hasSequence } from './has-sequence';
import { pathSegments } from './path-segments';
import { GIT_DIR_FILES, REPO_SEGMENTS, REPO_SEQUENCES } from './repo-paths.constants';

const repoConfigPath = (path: string): boolean => {
  const segments = pathSegments(path);
  return segments.some((segment) => REPO_SEGMENTS.has(segment))
    || GIT_DIR_FILES.has(segments[segments.length - 1] ?? '')
    || REPO_SEQUENCES.some((sequence) => hasSequence(segments, sequence));
};

export { repoConfigPath };
