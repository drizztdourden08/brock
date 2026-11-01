/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { DISPLAY_ROW_COPY } from '../src/renderer/DisplaySettingsTab/DisplaySettingsTab.constants';
import { displaySections } from '../src/renderer/DisplaySettingsTab/behavior/display-sections';
import { refreshRateRows } from '../src/renderer/DisplaySettingsTab/behavior/refresh-rate-rows';
import { DEFAULT_DISPLAY_SETTINGS, UNSUPPORTED_SYNCED_RATE } from '../src/display.constants';

const keysOf = (hasWindow: boolean): string[] =>
  displaySections(hasWindow).flatMap((section) => (section.items ?? []).map((item) => item.key));

describe('display settings search sections', () => {
  it('indexes every row the tab renders when the host has a window', () => {
    expect(keysOf(true)).toEqual(['windowMode', 'displayMonitor', 'detectedRate', 'syncedRateInFullscreen', 'syncedRateTargetHz', 'changeRate']);
  });

  it('leaves the window rows out on a host without a window', () => {
    expect(keysOf(false)).toEqual(['detectedRate', 'syncedRateInFullscreen', 'syncedRateTargetHz', 'changeRate']);
  });

  it('gives each row the label, description, hint and keywords of the shared copy', () => {
    const items = displaySections(true).flatMap((section) => section.items ?? []);
    for (const item of items) {
      const copy = DISPLAY_ROW_COPY[item.key as keyof typeof DISPLAY_ROW_COPY];
      expect(item).toMatchObject({ label: copy.label, description: copy.description, hint: copy.hint, keywords: copy.keywords });
    }
  });

  it('keeps the rendered row titles identical to the indexed labels', () => {
    const rows = refreshRateRows({
      settings: DEFAULT_DISPLAY_SETTINGS,
      status: { ...UNSUPPORTED_SYNCED_RATE, supported: true, availableRates: [60, 120] },
      selected: 60,
      readout: null,
      changeButton: null,
      onSynced: () => undefined,
      onTarget: () => undefined,
    });
    const titles = rows.flatMap((row) => (row.title === undefined ? [] : [[row.id, row.title]]));
    expect(titles).toEqual([
      ['syncedRateInFullscreen', DISPLAY_ROW_COPY.syncedRateInFullscreen.label],
      ['syncedRateTargetHz', DISPLAY_ROW_COPY.syncedRateTargetHz.label],
      ['changeRate', DISPLAY_ROW_COPY.changeRate.label],
    ]);
  });
});
