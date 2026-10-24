/* @layer tooling-scripts @kind logic */
import { linkLauncher } from '../launcher/link-launcher.mjs';
import { fail } from '../log.mjs';

const FORWARD_HINT = `  import { runThreadCli } from '@drizztdourden08/brock-thread/cli';
  and, before it handles its own words:
  const code = await runThreadCli(argv);
  if (code !== null) return code;`;

/**
 * @param {string[]} args the words after link
 * @param {string} cwd the repo root
 * @returns {number} exit code
 */
const runLink = (args, cwd) => {
  try {
    const result = linkLauncher(cwd, args.includes('--force'));
    if (result.mode === 'launcher') {
      const changed = [result.written ? result.file : null, ...result.fields].filter(Boolean);
      console.log(changed.length ? `${result.name}: wrote ${changed.join(', ')}` : `${result.name}: the launcher is already in place`);
      return 0;
    }
    if (result.delegates) {
      console.log(`${result.name}: ${result.file} already forwards the thread verbs`);
      return 0;
    }
    console.error(`${result.name} is already a command of this repo (${result.file}), so it must forward the thread verbs. In ${result.file}:\n${FORWARD_HINT}`);
    return 1;
  } catch (error) {
    return fail('brock-thread', error.message);
  }
};

export { runLink };
