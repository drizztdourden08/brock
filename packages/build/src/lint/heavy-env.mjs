/* @layer tooling-scripts @kind logic */
import { DEFAULT_MEMORY_MB, HEAP_FLAG, MEMORY_ENV } from './lint.constants.mjs';

const ceilingOf = (env) => {
  const wanted = Number(env[MEMORY_ENV]);
  return Number.isInteger(wanted) && wanted > 0 ? wanted : DEFAULT_MEMORY_MB;
};

/**
 * @param {NodeJS.ProcessEnv} [env] the environment the child would inherit
 * @returns {NodeJS.ProcessEnv} env with a heap ceiling in NODE_OPTIONS
 */
const heavyNodeEnv = (env = process.env) => {
  const options = env.NODE_OPTIONS ?? '';
  if (HEAP_FLAG.test(options)) return env;
  return { ...env, NODE_OPTIONS: [options, `--max-old-space-size=${ceilingOf(env)}`].filter(Boolean).join(' ') };
};

export { heavyNodeEnv };
