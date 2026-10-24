/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';

/**
 * @returns {{ available: () => boolean, run: (args: string[]) => { ok: boolean, out: string } }} the dpkg-deb program of this machine
 */
const dpkgDeb = () => ({
  available: () => spawnSync('dpkg-deb', ['--version'], { stdio: 'ignore' }).status === 0,
  run: (args) => {
    const result = spawnSync('dpkg-deb', args, { encoding: 'utf8' });
    return { ok: result.status === 0, out: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
  },
});

export { dpkgDeb };
