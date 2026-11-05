/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { resolveWidgetGate } from '../src/widgets/gates/resolve-widget-gate';

type Flags = Record<string, boolean>;

const rules = {
  isOn: (settings: Flags, id: string) => settings[id] === true,
  gameDataBlockedBy: 'safeMode',
  messageOf: (id: string) => (id === 'tracker' ? 'Turn the tracker on' : undefined),
  targetOf: (id: string) => `settings#${id}`,
};

describe('K2 resolveWidgetGate', { tags: ['critical'] }, () => {
  it('lets an ungated widget through', () => {
    expect(resolveWidgetGate({}, {}, rules)).toBeNull();
  });

  it('blocks a game data widget while the blocker setting is on', () => {
    const state = resolveWidgetGate({ readsGameData: true }, { safeMode: true }, rules);
    expect(state).toEqual({ message: 'Unavailable: safeMode', settingId: 'settings#safeMode' });
  });

  it('blocks a widget whose required setting is off, with its message', () => {
    const state = resolveWidgetGate({ requiresSetting: 'tracker' }, { tracker: false }, rules);
    expect(state).toEqual({ message: 'Turn the tracker on', settingId: 'settings#tracker' });
  });

  it('passes when the required setting is on', () => {
    expect(resolveWidgetGate({ requiresSetting: 'tracker', readsGameData: true }, { tracker: true }, rules)).toBeNull();
  });
});
