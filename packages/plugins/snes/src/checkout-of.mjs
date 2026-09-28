/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';

/**
 * @param {{ rootDir: string }} ctx
 * @returns {string} the checkout the command runs in, else the main checkout
 */
const checkoutOf = (ctx) => {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    return ctx.rootDir;
  }
};

export { checkoutOf };
