/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { dataFiles } from '../data-files.mjs';
import { verbatimText } from '../verbatim-text.mjs';
import { LINT_TIMEOUT_MS, app, header, lintMessages, lintRules, put, removeRoots } from './lint-fixture.mjs';

afterEach(removeRoots);

const PROSE_RULES = ['local/no-em-dash', 'local/no-smart-punctuation', 'local/no-slop-prose'];
const DASH = String.fromCodePoint(0x2014);
const QUOTES = [String.fromCodePoint(0x201c), String.fromCodePoint(0x201d)];
const VENDOR_WORD = ['chat', 'bot'].join('');
const SOURCE = 'the dialogue table of a game, as the game shows it';
const VERBATIM = `/* @layer shared-game @kind verbatim @source ${SOURCE} */\n`;

const dialogue = (count = 1) => [
  'const DIALOGUE = [',
  ...Array.from({ length: count }, (_, i) => `  { id: 'line-${i}', text: 'Welcome back, traveller\x21 Rest here.' },`),
  `  { id: 'warn', text: \`Beware${DASH}the bridge is out.\` },`,
  `  { id: 'quote', text: '${QUOTES[0]}Halt${QUOTES[1]}, said the guard.' },`,
  '];',
  '',
  "const SPEAKERS = ['guard'];",
  '',
  'export { DIALOGUE, SPEAKERS };',
  '',
].join('\n');

const proseHits = (rules) => rules.filter((rule) => PROSE_RULES.includes(rule));

describe('the verbatim file kind', () => {
  it('lists a verbatim file with the source its header names, and turns it into a verbatimText entry', () => {
    const root = app();
    put(root, 'text/dialogue.ts', `${VERBATIM}${dialogue()}`);
    put(root, 'text/unsourced.ts', `${header('verbatim')}${dialogue()}`);
    expect(dataFiles(root)).toEqual([{ file: 'text/dialogue.ts', kind: 'verbatim', source: SOURCE }, { file: 'text/unsourced.ts', kind: 'verbatim' }]);
    expect(verbatimText(dataFiles(root))).toEqual([{ files: ['text/dialogue.ts'], why: `@kind verbatim, reproduced from ${SOURCE}` }]);
  });

  it('skips the string values of a verbatim file and gives it the data exemptions', async () => {
    const root = app();
    put(root, 'text/dialogue.ts', `${VERBATIM}${dialogue(240)}`);
    expect(await lintRules(root, 'text/dialogue.ts')).toEqual([]);
  }, LINT_TIMEOUT_MS);

  it('reads the same strings in a data file, so UI strings still pass the prose rules', async () => {
    const root = app();
    put(root, 'text/dialogue.ts', `${header('data')}${dialogue()}`);
    expect(proseHits(await lintRules(root, 'text/dialogue.ts'))).toEqual(expect.arrayContaining(PROSE_RULES));
  }, LINT_TIMEOUT_MS);

  it('fails a verbatim header without a source, and then reads its strings', async () => {
    const root = app();
    put(root, 'text/dialogue.ts', `${header('verbatim')}${dialogue()}`);
    const rules = await lintRules(root, 'text/dialogue.ts');
    expect(rules).toContain('brock/verbatim-source');
    expect(proseHits(rules)).toEqual(expect.arrayContaining(PROSE_RULES));
  }, LINT_TIMEOUT_MS);

  it('lets a vendor name stand in a verbatim string, but still reads comments and refuses logic', async () => {
    const root = app();
    const code = [`const DIALOGUE = ['Ask the ${VENDOR_WORD}'];`, `// Saved\x21 Ask the ${VENDOR_WORD}.`, 'const pick = () => DIALOGUE[0];', '', 'export { DIALOGUE, pick };', ''].join('\n');
    put(root, 'text/dialogue.ts', `${VERBATIM}${code}`);
    const rules = await lintMessages(root, 'text/dialogue.ts');
    expect(rules.map((m) => m.ruleId)).toEqual(expect.arrayContaining(['local/no-tool-brand-words', 'local/no-slop-prose', 'local/no-comments', 'brock/data-only']));
    expect(rules.filter((m) => m.ruleId === 'local/no-tool-brand-words')).toHaveLength(1);
    expect(rules.find((m) => m.ruleId === 'brock/data-only').message).toMatch(/^A @kind verbatim file holds data only/);
  }, LINT_TIMEOUT_MS);
});
