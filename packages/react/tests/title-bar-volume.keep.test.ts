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
import { volumeTitleBarItem } from '../src/volume/volume-title-bar-item';

const CONTROLS: TitleBarControls = { fullscreen: true, pin: true, minimize: true, maximize: true };

const spec = (patch: Partial<TitleBarVolumeSpec> = {}): TitleBarVolumeSpec => ({
  kind: 'volume', label: 'Volume', value: 0.8, muted: false, onChange: () => undefined, onMuteToggle: () => undefined, ...patch,
});

const platform = (): Platform => {
  const web = createPlatform(createWebFactory());
  return { ...web, capabilities: { ...web.capabilities, titleBar: true, windowChrome: true } };
};

const Bar = (props: { source: TitleBarItemSource }) => {
  const actions = useTitleBarActions(appTitleBarSources([{ id: 'sound', source: props.source }], []));
  return createElement(AppTitleBar, { title: 'Demo', menu: [], controls: CONTROLS, instanceName: null, hidden: false, actions });
};

const draw = (source: TitleBarItemSource): string => renderToStaticMarkup(createElement(PlatformContext.Provider, { value: platform() }, createElement(Bar, { source })));

describe('the volume title bar item', () => {
  it('becomes a bar button whose click toggles mute, its sound waves following the level', () => {
    const onMuteToggle = vi.fn();
    const action = toBarAction('sound', spec({ onMuteToggle }));
    expect(action).toMatchObject({ id: 'sound', bar: 'button', icon: 'volume-2', tone: 'primary', label: 'Mute', status: 'Volume 80%' });
    if (action.bar === 'dropdown') throw new Error('a volume item is a button');
    action.onSelect();
    expect(onMuteToggle).toHaveBeenCalledOnce();
    expect(toBarAction('sound', spec({ value: 0.3 }))).toMatchObject({ icon: 'volume-1', tone: 'primary' });
  });

  it('shows the red X with Unmute when muted or at zero', () => {
    expect(toBarAction('sound', spec({ muted: true }))).toMatchObject({ icon: 'volume-x', tone: 'danger', label: 'Unmute', status: 'Volume 80%' });
    expect(toBarAction('sound', spec({ value: 0 }))).toMatchObject({ icon: 'volume-x', tone: 'danger', label: 'Unmute' });
  });

  it('takes the mute and unmute labels it is given', () => {
    expect(toBarAction('sound', spec({ labels: { mute: 'Couper', unmute: 'Rétablir' } }))).toMatchObject({ label: 'Couper' });
  });

  it('draws the ready-made item from the volume store in the bar, and marks it as a volume item', () => {
    const html = draw(volumeTitleBarItem());
    expect(html).toContain('data-bar-item="action:sound"');
    expect(html).toContain('aria-label="Mute"');
    expect(html).toContain('window-title-bar__icon--primary');
    expect(volumeItems.list()).toContain('sound');
  });

  it('draws a muted item in the danger tone with Unmute as its label', () => {
    const muted = draw(() => spec({ muted: true }));
    expect(muted).toContain('aria-label="Unmute"');
    expect(muted).toContain('window-title-bar__icon--danger');
  });
});

describe('volumeChecks', () => {
  it('passes a volume item that shows, mutes, unmutes and tucks into the menu', () => {
    const outcomes = volumeChecks('sound', { shown: true, toggled: true, restored: true, width: 360, tucked: true, inMenu: true });
    expect(outcomes.map((check) => [check.id, check.pass])).toEqual([['volume-sound-shown', true], ['volume-sound-mutes', true], ['volume-sound-tucks', true]]);
  });

  it('fails an item that stays on a narrow bar or never mutes', () => {
    const outcomes = volumeChecks('sound', { shown: true, toggled: false, restored: false, width: 360, tucked: false, inMenu: true });
    expect(outcomes.filter((check) => !check.pass).map((check) => check.reason)).toEqual([
      'a click on "sound" did not toggle mute',
      'in a 360 px wide window "sound" stays on the bar',
    ]);
  });
});
