/* @layer tooling-scripts @kind logic */
import { runLink } from './run-link.mjs';
import { runThread, threadVerbNames } from './run-thread.mjs';

const USAGE = `brock-thread link [--force]    install the repo's own command (bin/<name>.mjs), named by brock.workspace.mjs
brock-thread <verb> ...        run a thread verb: ${threadVerbNames().join(', ')}`;

/**
 * @param {string[]} argv the words after the program name
 * @param {string} [cwd]
 * @returns {Promise<number | null>} the exit code, null for a foreign word
 */
const runThreadCli = async (argv, cwd = process.cwd()) => {
  const [word, ...rest] = argv;
  if (word === 'link') return runLink(rest, cwd);
  if (threadVerbNames().includes(word)) return runThread(argv);
  return null;
};

/**
 * @param {string[]} argv
 * @returns {Promise<number>} the exit code of the brock-thread bin
 */
const runThreadBin = async (argv) => {
  const code = await runThreadCli(argv);
  if (code !== null) return code;
  console.error(`${argv.length ? `Unknown word "${argv[0]}".\n\n` : ''}${USAGE}`);
  return 1;
};

export { runThread, runThreadBin, runThreadCli, threadVerbNames };
