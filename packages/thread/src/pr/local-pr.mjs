/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';

const listFromCoord = (cwd) => {
  try {
    const out = execFileSync('coord', ['pr', 'list', '--json'], { windowsHide: true, cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: process.platform === 'win32' });
    const parsed = JSON.parse(out);
    return Array.isArray(parsed) ? parsed : (parsed.prs ?? null);
  } catch {
    return null;
  }
};

/**
 * @param {{ id: string | null, options: Record<string, string | boolean>, base: string, cwd: string }} request
 * @returns {{ id: string | null, head: string, base: string }}
 */
const resolveLocalPr = ({ id, options, base, cwd }) => {
  if (typeof options.head === 'string') return { id, head: options.head, base: typeof options.base === 'string' ? options.base : base };
  if (!id) throw new Error('Name the pull request: pr merge --local PR-n, or pass --head <branch> [--base <branch>].');
  const list = listFromCoord(cwd);
  if (!list) throw new Error(`coord pr is not available here, so ${id} cannot be read. Pass --head <branch> [--base <branch>].`);
  const found = list.find((pr) => pr.id === id);
  if (!found) throw new Error(`coord pr list has no ${id}.`);
  if (found.status && found.status !== 'open') throw new Error(`${id} is ${found.status}, not open.`);
  return { id, head: found.head, base: typeof options.base === 'string' ? options.base : (found.base ?? base) };
};

export { resolveLocalPr };
