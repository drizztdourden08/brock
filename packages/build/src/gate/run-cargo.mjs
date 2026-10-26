/* @layer tooling-scripts @kind logic */
import { runInherit } from '../run.mjs';

/**
 * @param {{ dir: string, command: string[], args: string[], env?: Record<string, string> }} step
 * @returns {Promise<number>} the exit code of cargo, spawned without a shell
 */
const runCargo = ({ dir, command, args, env = {} }) => {
  const [program, ...lead] = command;
  return runInherit(program, [...lead, ...args], { cwd: dir, env: { ...process.env, ...env }, shell: false });
};

export { runCargo };
