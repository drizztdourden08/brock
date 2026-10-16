/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { describeVersion } from '../src/renderer/UpdateDialog/behavior/describe-version';
import type { VersionOption } from '../src/updater.type';

const RELEASED = '2026-10-16T21:40:12Z';

const optionOf = (patch: Partial<VersionOption>): VersionOption => ({
  version: '1.2.0', releaseNotes: '', releaseDate: RELEASED, size: 0, downloadSize: 0, prerelease: false, downgrade: false, installed: false, ...patch,
});

describe('describeVersion', () => {
  it('reads the release date as a Tessera date', () => {
    expect(describeVersion(optionOf({ installed: true }))).toBe(`${formatDate(RELEASED, 'date')} · installed`);
  });

  it('leaves the date out when the release has none', () => {
    expect(describeVersion(optionOf({ releaseDate: '', installed: true }))).toBe('installed');
  });
});
