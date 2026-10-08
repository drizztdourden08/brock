/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkReleaseNote as standardsCheck } from '@drizztdourden08/standards/release-notes';
import { checkNoteFile, checkReleaseNote } from '../src/index.mjs';

const GOOD = `<!-- @layer docs @kind doc -->
# Atlas v1.2.0

The map opens where you left it, and two crashes on start are gone.

## View

- The map opens on the last place you looked at.

## Fixes

- The app no longer closes on start when a profile is empty.
`;

const messagesOf = (text, rules = {}) => checkReleaseNote(text, { version: '1.2.0', ...rules }).map((f) => `${f.line}: ${f.message}`);

const made = [];
afterEach(() => { made.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })); });

describe('the release note standard', () => {
  it('passes a note in the format, and holds the title to the version and product', () => {
    expect(messagesOf(GOOD, { product: 'Atlas' })).toEqual([]);
    expect(messagesOf(GOOD, { product: 'Globe', version: '1.3.0' })).toEqual([
      '2: the title says v1.2.0, the file is v1.3.0',
      '2: the title names "Atlas"; the product is "Globe"',
    ]);
  });

  it('wants known sections with Fixes last, and plain sentences for users', () => {
    const text = GOOD.replace('## View', '## Gadgets').replace('- The map opens on the last place you looked at.', '- fix: map (#12)');
    expect(messagesOf(text)).toEqual([
      expect.stringMatching(/^6: "## Gadgets" is not a release note section/),
      '8: the bullet starts like a fragment; open it with a capital letter, as a sentence',
      '8: the bullet does not end its sentence; finish it with a period',
      '8: the bullet holds an issue or pull request number; say what changed',
      '8: the bullet holds a commit prefix; write a sentence for the people who use it',
    ]);
    expect(messagesOf(GOOD.replace('## View', '## Gadgets'), { sections: ['Gadgets'] })).toEqual([]);
  });

  it('rejects a draft and runs the writing gate', () => {
    expect(messagesOf(`<!-- release-notes: draft -->\n${GOOD}`)[0]).toMatch(/^1: still a draft/);
    const filler = ['ro', 'bust'].join('');
    expect(messagesOf(GOOD.replace('two crashes', `two ${filler} crashes`))[0]).toMatch(new RegExp(`^4: "${filler}"`));
  });

  it('checks a note file at the repo root, and names a missing one', () => {
    const root = mkdtempSync(join(tmpdir(), 'thread-notes-'));
    made.push(root);
    mkdirSync(join(root, 'release-notes'));
    writeFileSync(join(root, 'release-notes', 'v1.2.0.md'), GOOD);
    expect(checkNoteFile({ rootDir: root, version: 'v1.2.0', product: 'Atlas' })).toEqual([]);
    expect(checkNoteFile({ rootDir: root, version: '1.3.0' })).toEqual([expect.stringMatching(/^release-notes\/v1\.3\.0\.md: missing\./)]);
  });

  it('is the checker of standards, which also holds every newer note to the format', () => {
    expect(checkReleaseNote).toBe(standardsCheck);
    const root = mkdtempSync(join(tmpdir(), 'thread-notes-'));
    made.push(root);
    mkdirSync(join(root, 'release-notes'));
    writeFileSync(join(root, 'release-notes', 'v1.2.0.md'), GOOD);
    writeFileSync(join(root, 'release-notes', 'v1.3.0.md'), `<!-- release-notes: draft -->\n${GOOD.replace('v1.2.0', 'v1.3.0')}`);
    expect(checkNoteFile({ rootDir: root, version: '1.2.0' })).toEqual([expect.stringMatching(/^release-notes\/v1\.3\.0\.md:1 {2}still a draft/)]);
  });
});
