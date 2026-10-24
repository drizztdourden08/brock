/* @layer electron-main @kind logic */
import { hasSequence } from './has-sequence';
import { pathSegments } from './path-segments';
import { REPO_SEGMENTS, REPO_SEQUENCES } from './repo-paths.constants';

const repoConfigPath = (path: string): boolean => {
  const segments = pathSegments(path);
  return segments.some((segment) => REPO_SEGMENTS.has(segment)) || REPO_SEQUENCES.some((sequence) => hasSequence(segments, sequence));
};

export { repoConfigPath };
