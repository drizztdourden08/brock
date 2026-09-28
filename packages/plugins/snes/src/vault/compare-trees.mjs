/* @layer tooling-scripts @kind logic */
const DIRECTIONS = {
  'local-only': 'push',
  'local-newer': 'push',
  'local-deleted': 'push',
  'remote-only': 'pull',
  'remote-newer': 'pull',
  'remote-deleted': 'pull',
};

const unrecorded = ({ local, remote }) => {
  if (local && remote) return 'conflict';
  return local ? 'local-only' : 'remote-only';
};

const againstBase = ({ local, remote, base }) => {
  if (local === base) return remote === null ? 'remote-deleted' : 'remote-newer';
  if (remote === base) return local === null ? 'local-deleted' : 'local-newer';
  return 'conflict';
};

const classify = (entry) => {
  if (entry.local === entry.remote) return 'same';
  return entry.base === null ? unrecorded(entry) : againstBase(entry);
};

/**
 * @param {{ local: Record<string, string>, remote: Record<string, string>, base: Record<string, string> }} sides
 * @returns {{ path: string, local: string | null, remote: string | null, base: string | null, status: string, direction: string | null }[]}
 */
const compareTrees = ({ local, remote, base }) => {
  const paths = [...new Set([...Object.keys(local), ...Object.keys(remote), ...Object.keys(base)])].sort();
  return paths
    .map((path) => {
      const entry = { path, local: local[path] ?? null, remote: remote[path] ?? null, base: base[path] ?? null };
      const status = classify(entry);
      return { ...entry, status, direction: DIRECTIONS[status] ?? null };
    })
    .filter((entry) => entry.status !== 'same');
};

/**
 * @param {{ local: Record<string, string>, remote: Record<string, string> }} sides
 * @returns {Record<string, string>} the paths both sides agree on
 */
const agreedIndex = ({ local, remote }) => {
  const agreed = {};
  for (const [path, hash] of Object.entries(local)) {
    if (remote[path] === hash) agreed[path] = hash;
  }
  return agreed;
};

export { agreedIndex, compareTrees };
