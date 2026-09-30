/* @layer tooling-scripts @kind logic */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { allPlatforms, BUNDLE_LABELS, BUNDLES, targetInputProblem } from '@drizztdourden08/brock-build';

const choices = () => [
  ...Object.keys(BUNDLES).map((id) => ({ id, note: `${BUNDLE_LABELS[id]} (bundle)` })),
  ...allPlatforms().map((platform) => ({ id: platform.id, note: platform.supported ? platform.label : `${platform.label}, not supported yet` })),
];

/**
 * @param {string} answer numbers or ids, comma or space separated
 * @param {{ id: string }[]} list
 * @returns {string[]}
 */
const parseAnswer = (answer, list) => [...new Set(answer.split(/[\s,]+/).filter(Boolean).map((token) => (/^\d+$/.test(token) ? (list[Number(token) - 1]?.id ?? token) : token)))];

/**
 * @param {string[]} fallback the targets Enter keeps
 * @returns {Promise<string[]>} ids and bundles for brock.config.ts targets
 */
const promptPlatforms = async (fallback) => {
  if (!stdin.isTTY) return fallback;
  const list = choices();
  console.log('\nWhich platforms does the app ship to? Numbers or ids, comma separated.');
  list.forEach((choice, index) => console.log(`  ${String(index + 1).padStart(2)}  ${choice.id.padEnd(8)} ${choice.note}`));
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    for (;;) {
      const answer = (await rl.question(`Platforms (${fallback.join(', ')}): `)).trim();
      const tokens = answer ? parseAnswer(answer, list) : fallback;
      const problem = targetInputProblem(tokens);
      if (!problem) return tokens;
      console.log(`  ${problem}`);
    }
  } finally {
    rl.close();
  }
};

export { promptPlatforms };
