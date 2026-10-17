/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { Platform, TitleBarControls } from '@drizztdourden08/brock-core';
import { createPlatform } from '@drizztdourden08/brock-core';
import { AppTitleBar } from '../src/app/BrockApp/sub-components/AppTitleBar';
import { PlatformContext } from '../src/platform/platform-context';
import { createWebFactory } from '../src/platform/hosts/web-factory';
import { useTitleBarActions } from '../src/shell/TitleBar/behavior/useTitleBarActions';
import { appTitleBarSources } from '../src/title-bar/app-title-bar-sources';
import { toBarAction } from '../src/title-bar/to-bar-action';
import type { TitleBarItemSource, TitleBarVolumeSpec } from '../src/title-bar/title-bar-item.type';
import { volumeItems } from '../src/title-bar/volume-items';
import { volumeChecks } from '../src/review/checks/volume-checks';
import type { VolumeItemSnapshot } from '../src/review/review.type';
import { volumeTitleBarItem } from '../src/volume/volume-title-bar-item';

const CONTROLS: TitleBarControls = { fullscreen: true, pin: true, minimize: true, maximize: true };

const spec = (patch: Partial<TitleBarVolumeSpec> = {}): TitleBarVolumeSpec => ({
  kind: 'volume', label: 'Volume', value: 0.8, muted: false, onChange: () => undefined, onMuteToggle: () => undefined, ...patch,
});

const volumeOf = (patch: Partial<TitleBarVolumeSpec> = {}) => {
  const action = toBarAction('sound', spec(patch));
  if (action.bar !== 'volume') throw new Error('a volume item is a Tessera volume action');
  return action;
};

const platform = (): Platform => {
  const web = createPlatform(createWebFactory());
  return { ...web, capabilities: { ...web.capabilities, titleBar: true, windowChrome: true } };
};

const Bar = (props: { source: TitleBarItemSource }) => {
  const actions = useTitleBarActions(appTitleBarSources([{ id: 'sound', source: props.source }], []));
  return createElement(AppTitleBar, { title: 'Demo', menu: [], controls: CONTROLS, instanceName: null, hidden: false, actions });
};

const draw = (source: TitleBarItemSource): string => renderToStaticMarkup(createElement(PlatformContext.Provider, { value: platform() }, createElement(Bar, { source })));

const SNAPSHOT: VolumeItemSnapshot = {
  shown: true, hoverOpens: true, focusOpens: true, slides: true, toggled: true, restored: true, width: 360, tucked: true, muteRow: true, sliderRow: true,
};

describe('the volume title bar item', () => {
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

  it('draws the ready-made item from the volume store as a volume control in the bar, and marks it as a volume item', () => {
    const html = draw(volumeTitleBarItem());
    expect(html).toContain('data-bar-item="action:sound"');
    expect(html).toContain('window-title-bar__volume');
    expect(html).toContain('volume-control--popover');
    expect(html).toContain('aria-label="Mute"');
    expect(volumeItems.list()).toContain('sound');
  });

  it('labels a muted item Unmute', () => {
    expect(draw(() => spec({ muted: true }))).toContain('aria-label="Unmute"');
  });
});

describe('volumeChecks', () => {
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
