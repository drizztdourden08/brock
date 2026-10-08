/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkReleaseNote, draftReleaseNote, releaseVersionOf } from '@drizztdourden08/standards/release-notes';

const REPO = join(import.meta.dirname, '../../..');

const read = (path) => readFileSync(join(REPO, path), 'utf8');

describe('Brock releases itself with one note per version', () => {
  it('runs the reusable release workflow of standards with its release note command', () => {
    const lines = read('.github/workflows/release.yml').split(/\r?\n/);
    expect(lines).toContain('    uses: drizztdourden08/standards/.github/workflows/release.yml@v0');
    const at = lines.indexOf('    with:');
    expect(lines[at + 1]).toBe('      release-notes: pnpm exec standards release-notes');
    const root = JSON.parse(read('package.json'));
    expect(root.scripts['release-notes']).toBe('standards release-notes');
    expect(root.devDependencies['@drizztdourden08/standards']).toBe('^0.8.0');
  });

  it('releases the version every published package shares, and drafts a Brock note for it that the check holds back', () => {
    const shared = JSON.parse(read('packages/core/package.json')).version;
    expect(releaseVersionOf(REPO)).toBe(shared);
    const draft = draftReleaseNote({ rootDir: REPO, version: shared, product: 'Brock' });
    expect(draft.split('\n').slice(0, 2)).toEqual(['<!-- release-notes: draft -->', `# Brock v${shared}`]);
    expect(checkReleaseNote(draft, { version: shared, product: 'Brock' })[0].message).toMatch(/^still a draft/);
  });
});
