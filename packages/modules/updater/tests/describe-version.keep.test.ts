/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { createI18n } from '@drizztdourden08/brock-core/i18n';
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { describeVersion } from '../src/renderer/UpdateDialog/behavior/describe-version';
import { updaterLayer } from '../src/renderer/updater-layer';
import type { VersionOption } from '../src/updater.type';

const RELEASED = '2026-10-16T21:40:12Z';
const english = createI18n({ base: 'en', layers: [updaterLayer] });
const text = (value: Parameters<typeof english.text>[0]): string => english.text(value);

const optionOf = (patch: Partial<VersionOption>): VersionOption => ({
  version: '1.2.0', releaseNotes: '', releaseDate: RELEASED, size: 0, downloadSize: 0, prerelease: false, downgrade: false, installed: false, ...patch,
});

describe('K1 describeVersion', { tags: ['critical'] }, () => {
  it('reads the release date as a Tessera date', () => {
    expect(describeVersion(optionOf({ installed: true }), text)).toBe(`${formatDate(RELEASED, 'date')} · installed`);
  });

  it('leaves the date out when the release has none', () => {
    expect(describeVersion(optionOf({ releaseDate: '', installed: true }), text)).toBe('installed');
  });
});
