/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { toBarAction } from '../src/title-bar/to-bar-action';
import type { TitleBarVolumeSpec } from '../src/title-bar/title-bar-item.type';
import { volumeChecks } from '../src/review/checks/volume-checks';
import type { VolumeItemSnapshot } from '../src/review/review.type';

const spec = (patch: Partial<TitleBarVolumeSpec> = {}): TitleBarVolumeSpec => ({
  kind: 'volume', label: 'Volume', value: 0.8, muted: false, onChange: () => undefined, onMuteToggle: () => undefined, ...patch,
});

const volumeOf = (patch: Partial<TitleBarVolumeSpec> = {}) => {
  const action = toBarAction('sound', spec(patch));
  if (action.bar !== 'volume') throw new Error('a volume item is a Tessera volume action');
  return action;
};

const SNAPSHOT: VolumeItemSnapshot = {
  shown: true, hoverOpens: true, focusOpens: true, slides: true, toggled: true, restored: true, width: 360, tucked: true, muteRow: true, sliderRow: true,
};

describe('K1 the volume title bar item', { tags: ['critical'] }, () => {
  it('becomes a Tessera volume action on a 0 to 1 range, with its level, label and shortcut', () => {
    const onChange = vi.fn();
    const action = volumeOf({ onChange, shortcut: 'Ctrl+M' });
    expect(action).toMatchObject({ id: 'sound', label: 'Volume', bar: 'volume', value: 0.8, muted: false, min: 0, max: 1, step: 0.01, shortcut: 'Ctrl+M' });
    action.onChange(0.4);
    expect(onChange).toHaveBeenCalledWith(0.4);
  });

  it('calls onMuteToggle only when the muted state Tessera asks for differs', () => {
    const onMuteToggle = vi.fn();
    volumeOf({ onMuteToggle }).onMutedChange(false);
    expect(onMuteToggle).not.toHaveBeenCalled();
    volumeOf({ onMuteToggle }).onMutedChange(true);
    expect(onMuteToggle).toHaveBeenCalledOnce();
    volumeOf({ muted: true, onMuteToggle }).onMutedChange(true);
    volumeOf({ muted: true, onMuteToggle }).onMutedChange(false);
    expect(onMuteToggle).toHaveBeenCalledTimes(2);
  });
});

describe('K1 volumeChecks', { tags: ['critical'] }, () => {
  it('passes a volume item whose slider opens and moves, that mutes, unmutes and tucks into the menu with both rows', () => {
    expect(volumeChecks('sound', SNAPSHOT).map((check) => [check.id, check.pass])).toEqual([
      ['volume-sound-shown', true], ['volume-sound-slider-opens', true], ['volume-sound-slides', true], ['volume-sound-mutes', true], ['volume-sound-tucks', true],
    ]);
    expect(volumeChecks('sound', { ...SNAPSHOT, hoverOpens: false })[1]?.reason).toBe('the slider of "sound" opens on focus');
  });

  it('fails an item whose slider never opens, that never mutes or stays on a narrow bar', () => {
    const outcomes = volumeChecks('sound', { ...SNAPSHOT, hoverOpens: false, focusOpens: false, slides: false, toggled: false, restored: false, tucked: false });
    expect(outcomes.filter((check) => !check.pass).map((check) => check.reason)).toEqual([
      'neither hover nor focus opens the slider of "sound"',
      'moving the slider of "sound" did not change the volume',
      'a click on "sound" did not toggle mute',
      'in a 360 px wide window "sound" stays on the bar',
    ]);
  });

  it('fails a tucked item whose menu lacks the slider row', () => {
    expect(volumeChecks('sound', { ...SNAPSHOT, sliderRow: false })[4]?.reason).toBe('in a 360 px wide window the main menu has no slider row for "sound"');
  });
});
