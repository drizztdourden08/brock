/* @layer tooling-scripts @kind logic */

/**
 * @param {{ pid: number, deadline?: number } | null} holder the lock file content
 * @param {{ now: number, isAlive: (pid: number) => boolean }} clock
 * @returns {'unknown' | 'dead' | 'hung' | 'busy'} hung means alive and past its own run budget
 */
const holderState = (holder, { now, isAlive }) => {
  if (!holder) return 'unknown';
  if (!isAlive(holder.pid)) return 'dead';
  return typeof holder.deadline === 'number' && now > holder.deadline ? 'hung' : 'busy';
};

export { holderState };
