/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { verbatimReport } from '../src/commands/verbatim-report.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-verbatim-report-');

afterEach(cleanup);

const BODY = "const LINES = ['a'];\n\nexport { LINES };\n";

describe('brock structure: the verbatim files', () => {
  it('lists every @kind verbatim file with the source its header names', () => {
    const root = tempDir();
    put(root, 'src/legal/font-licence.ts', `/* @layer shared-legal @kind verbatim @source the font licence, SIL OFL 1.1 */\n${BODY}`);
    put(root, 'src/text/quoted.ts', `/* @layer shared-text @kind verbatim */\n${BODY}`);
    put(root, 'src/records/tags.ts', `/* @layer shared-data @kind data */\n${BODY}`);
    expect(verbatimReport(root, 'brock structure')).toEqual([
      'brock structure: 2 @kind verbatim file(s); the dash, punctuation and prose rules skip their string values:',
      '  src/legal/font-licence.ts  source: the font licence, SIL OFL 1.1',
      '  src/text/quoted.ts  no @source in the header: lint fails and the prose rules still read it',
    ]);
  });

  it('prints nothing when no file is verbatim', () => {
    const root = tempDir();
    put(root, 'src/records/tags.ts', `/* @layer shared-data @kind data */\n${BODY}`);
    expect(verbatimReport(root, 'brock structure')).toEqual([]);
  });
});
