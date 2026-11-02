/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { advanceOf } from '../src/views/InputTester/sub-components/diagnostics-wizard/behavior/advance-of';
import { diagnosticsStepDefs } from '../src/views/InputTester/sub-components/diagnostics-wizard/behavior/diagnostics-step-defs';
import { isWizardBusy } from '../src/views/InputTester/sub-components/diagnostics-wizard/behavior/is-wizard-busy';
import { pickDeviceKey } from '../src/views/InputTester/sub-components/diagnostics-wizard/behavior/pick-device-key';
import { stepProblemOf } from '../src/views/InputTester/sub-components/diagnostics-wizard/behavior/step-problem-of';
import { visibleSteps } from '../src/views/InputTester/sub-components/diagnostics-wizard/behavior/wizard-steps';
import type { ChooserDevice } from '../src/views/InputTester/sub-components/diagnostics-wizard/diagnostics-wizard.type';

const pad = (deviceKey: string): ChooserDevice => ({
  deviceKey, vendorId: 0x045e, productId: 0x02ff, product: 'Pad', busType: 'usb', hasByteCapability: true,
});

const idsOf = (hasByteCapability: boolean, hasChooser: boolean) =>
  visibleSteps(hasByteCapability, hasChooser).map((info) => info.step);

describe('the steps of the diagnostics wizard', () => {
  it('lists all five steps when the user picks the controller', () => {
    expect(idsOf(true, true)).toEqual(['intro', 'choose-controller', 'byte-capture', 'positional-capture', 'summary']);
  });

  it('skips Choose a controller when the pad is preselected', () => {
    expect(idsOf(true, false)).toEqual(['intro', 'byte-capture', 'positional-capture', 'summary']);
  });

  it('skips byte capture for a pad with no HID side, with or without the chooser', () => {
    expect(idsOf(false, true)).not.toContain('byte-capture');
    expect(idsOf(false, false)).toEqual(['intro', 'positional-capture', 'summary']);
  });

  it('gives Tessera one step per visible step, with no Back on the first and the finish look on the last', () => {
    const finishLook = { label: 'Report', icon: 'bug' } as const;
    const defs = diagnosticsStepDefs({ steps: visibleSteps(true, false), summaryActions: null, finishLook });
    expect(defs.map((def) => def.id)).toEqual(['intro', 'byte-capture', 'positional-capture', 'summary']);
    expect(defs[0]?.buttons?.back).toBe(false);
    expect(defs[3]?.buttons?.next).toEqual(finishLook);
    expect(defs[1]?.buttons?.back).toBeUndefined();
    expect(defs[3]?.extra).toBeTypeOf('function');
    expect(defs[0]?.extra).toBeUndefined();
  });
});

describe('a preselected pad', () => {
  it('is chosen only when it is in the list, with no fallback to another pad', () => {
    const list = [pad('a'), pad('b')];
    expect(pickDeviceKey(list, 'b', true)).toBe('b');
    expect(pickDeviceKey(list, 'missing', true)).toBeNull();
    expect(pickDeviceKey(list, 'missing', false)).toBe('a');
  });

  it('reads the layout on Next from the intro, where a picked pad reads it on Next from the chooser', () => {
    const confirmChoice = () => Promise.resolve();
    const goNext = () => undefined;
    const byteNext = () => undefined;
    const fixed = advanceOf({ step: 'intro', preselected: true, confirmChoice, goNext }, byteNext);
    const picked = advanceOf({ step: 'intro', preselected: false, confirmChoice, goNext }, byteNext);
    expect(fixed).not.toBe(goNext);
    expect(picked).toBe(goNext);
    expect(advanceOf({ step: 'choose-controller', preselected: false, confirmChoice, goNext }, byteNext)).not.toBe(goNext);
    expect(advanceOf({ step: 'byte-capture', preselected: true, confirmChoice, goNext }, byteNext)).toBe(byteNext);
  });

  it('blocks the intro with a message once the hold is released and the pad is not there', () => {
    const base = { step: 'intro', releaseStatus: 'done', restoreStatus: 'pending', preselected: true } as const;
    expect(stepProblemOf({ ...base, deviceKey: null }, 0)).toMatch(/not found/);
    expect(stepProblemOf({ ...base, deviceKey: 'a' }, 0)).toBeNull();
    expect(stepProblemOf({ ...base, releaseStatus: 'pending', deviceKey: 'a' }, 0)).toMatch(/released/);
  });
});

describe('when Next is allowed', () => {
  const base = { releaseStatus: 'done', restoreStatus: 'done', preselected: false, deviceKey: 'a' } as const;

  it('needs a pad on the chooser, a capture on byte capture and the hold back on positional capture', () => {
    expect(stepProblemOf({ ...base, step: 'choose-controller', deviceKey: null }, 0)).not.toBeNull();
    expect(stepProblemOf({ ...base, step: 'byte-capture' }, 0)).not.toBeNull();
    expect(stepProblemOf({ ...base, step: 'byte-capture' }, 3)).toBeNull();
    expect(stepProblemOf({ ...base, step: 'positional-capture', restoreStatus: 'pending' }, 0)).not.toBeNull();
    expect(stepProblemOf({ ...base, step: 'summary' }, 0)).toBeNull();
  });

  it('is busy while the layout is read and while the hold comes back', () => {
    expect(isWizardBusy({ layoutStage: 'fetching', step: 'choose-controller', restoreStatus: 'pending' })).toBe(true);
    expect(isWizardBusy({ layoutStage: 'idle', step: 'positional-capture', restoreStatus: 'pending' })).toBe(true);
    expect(isWizardBusy({ layoutStage: 'done', step: 'positional-capture', restoreStatus: 'done' })).toBe(false);
  });
});
