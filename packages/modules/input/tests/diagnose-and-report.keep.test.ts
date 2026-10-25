/* @layer core @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { DeviceEntry } from '../src/device.type';
import type { DeviceCardAction } from '../src/renderer/device-card-action.type';
import type { DiagnosticsRunResult } from '../src/renderer/diagnostics-run-result.type';
import { REPORT_ACTION_ID } from '../src/renderer/input-renderer.constants';
import { otherPadActions } from '../src/renderer/other-pad-actions';
import { reportActionOf } from '../src/renderer/report-action-of';
import { shownDeviceCardActions } from '../src/renderer/shown-device-card-actions';
import { resolveDeviceFromEntry } from '../src/runtime/resolve-device';
import { diagnosticsRunResultOf } from '../src/views/InputTester/sub-components/diagnostics-wizard/behavior/diagnostics-run-result-of';

const pad: DeviceEntry = {
  deviceKey: '045e:02ff', vendorId: 0x045e, productId: 0x02ff, product: 'Pad', busType: 'usb', status: 'ready',
};

const action = (id: string, extra: Partial<DeviceCardAction> = {}): DeviceCardAction => ({ id, label: id, onSelect: vi.fn(), ...extra });

describe('one diagnose and report action per pad', () => {
  it('takes the action with the report id out of the pad page buttons and keeps the others', () => {
    const shown = shownDeviceCardActions([action(REPORT_ACTION_ID), action('export')], [], pad);
    expect(otherPadActions(shown).map((item) => item.action.id)).toEqual(['export']);
  });

  it('finds the registered report action for a pad, and none when it is hidden, disabled or absent', () => {
    const report = action(REPORT_ACTION_ID);
    expect(reportActionOf([action('export'), report], pad)).toBe(report);
    expect(reportActionOf([action('export')], pad)).toBeNull();
    expect(reportActionOf([action(REPORT_ACTION_ID, { visible: () => false })], pad)).toBeNull();
    expect(reportActionOf([action(REPORT_ACTION_ID, { disabled: true })], pad)).toBeNull();
  });

  it('uses the last report action registered under that id', () => {
    const first = action(REPORT_ACTION_ID, { label: 'first' });
    const second = action(REPORT_ACTION_ID, { label: 'second' });
    expect(reportActionOf([first, second], pad)?.label).toBe('second');
  });
});

describe('the result handed to the report action', () => {
  it('carries the pad, its captured layout entry, the mapping and both captures', () => {
    const result = diagnosticsRunResultOf({
      deviceKey: pad.deviceKey,
      capturedLayout: { deviceKey: pad.deviceKey, entry: pad, resolved: resolveDeviceFromEntry(pad) },
      mapping: 'mapping-line',
      byteCapture: null,
      positionalRecords: [],
    });
    expect(result).toEqual<DiagnosticsRunResult>({
      deviceKey: pad.deviceKey, entry: pad, mapping: 'mapping-line', byteCapture: null, positionalRecords: [],
    });
  });

  it('is empty when no pad was chosen, so nothing is handed over', () => {
    expect(diagnosticsRunResultOf({ deviceKey: null, capturedLayout: null, mapping: null, byteCapture: null, positionalRecords: [] })).toBeNull();
  });

  it('reaches the report action with the entry and the result', async () => {
    const onSelect = vi.fn();
    const report = action(REPORT_ACTION_ID, { onSelect });
    const result: DiagnosticsRunResult = { deviceKey: pad.deviceKey, entry: pad, mapping: null, byteCapture: null, positionalRecords: [] };
    const found = reportActionOf([report], pad);
    await found?.onSelect(pad, result);
    expect(onSelect).toHaveBeenCalledWith(pad, result);
  });
});
