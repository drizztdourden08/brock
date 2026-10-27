/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { controlSources } from '../src/app/control-sources';
import { settingsApi } from '../src/settings/api/settings-api';
import { settingsCatalog } from '../src/settings/api/settings-catalog';
import type { TabDef } from '../src/settings/settings.type';
import { createSettingsStore } from '../src/stores/create-settings-store';

interface Shape {
  theme: string;
  volume: number;
  notify: boolean;
  tags: string[];
  token: string;
  nested: { depth: number };
  mood: string;
}

const DEFAULTS: Shape = { theme: 'dark', volume: 5, notify: true, tags: ['a'], token: 'secret', nested: { depth: 1 }, mood: 'calm' };

const OPTIONS = [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'neon', label: 'Neon', disabled: true }];

const extra = new Map<string, unknown>([['project.name', 'demo']]);

const TAB: TabDef<object> = {
  id: 'general',
  label: 'General',
  navIcon: null,
  group: 'App',
  sections: () => [
    {
      id: 'look',
      title: 'Look',
      subsections: [
        {
          id: 'basic',
          title: 'Basic',
          items: [
            { key: 'theme', label: 'Theme', description: 'The colours.', control: { kind: 'choice', options: OPTIONS } },
            { key: 'volume', label: 'Volume', noDescription: true, control: { kind: 'range', min: 0, max: 10 } },
            { key: 'notify', label: 'Notify', noDescription: true },
          ],
        },
        {
          id: 'more',
          title: 'More',
          items: [
            { key: 'tags', label: 'Tags', noDescription: true, control: { kind: 'tags' } },
            { key: 'token', label: 'Token', noDescription: true, control: { kind: 'password' } },
            { key: 'nested.depth', label: 'Depth', noDescription: true, control: { kind: 'number', min: 0, max: 3 } },
            { key: 'mood', label: 'Mood', noDescription: true, visible: () => false, control: { kind: 'text' } },
          ],
        },
      ],
    },
    {
      id: 'project',
      title: 'Project',
      source: { get: (key) => extra.get(key), set: (key, value) => { extra.set(key, value); } },
      items: [{ key: 'project.name', label: 'Name', noDescription: true, control: { kind: 'text' } }],
    },
  ],
};

const store = createSettingsStore<Shape>({ defaults: DEFAULTS, load: () => Promise.resolve(null), save: () => Promise.resolve(), saveDelayMs: 1 });
let release: (() => void) | null = null;

const publish = async (hydrate: boolean): Promise<void> => {
  if (hydrate) await store.getState().hydrate('p1');
  release = controlSources.publish({ tabs: [TAB], settings: store, screens: null, tree: null });
};

afterEach(() => {
  release?.();
  release = null;
  store.getState().reset();
});

const itemOf = (key: string) => settingsCatalog()
  .flatMap((screen) => screen.sections)
  .flatMap((section) => [...section.items, ...section.subsections.flatMap((sub) => sub.items)])
  .find((item) => item.key === key);

describe('settingsCatalog', () => {
  it('is empty before the app publishes its settings', () => {
    expect(settingsCatalog()).toEqual([]);
  });

  it('lists the screen with its sections, subsections and route', async () => {
    await publish(true);
    const [screen] = settingsCatalog();
    expect(screen).toMatchObject({ id: 'general', label: 'General', group: 'App', route: 'settings', params: { tab: 'general' } });
    expect(screen?.sections.map((section) => section.id)).toEqual(['look', 'project']);
    expect(screen?.sections[0]?.subsections.map((sub) => sub.id)).toEqual(['basic', 'more']);
  });

  it('describes the control, choices, source and value of each item', async () => {
    await publish(true);
    expect(itemOf('theme')).toMatchObject({
      label: 'Theme',
      description: 'The colours.',
      source: 'app',
      settable: true,
      value: 'dark',
      control: { kind: 'choice', choices: [{ value: 'dark', disabled: false }, { value: 'light', disabled: false }, { value: 'neon', disabled: true }] },
    });
    expect(itemOf('volume')?.control).toEqual({ kind: 'range', min: 0, max: 10 });
    expect(itemOf('notify')?.control).toEqual({ kind: 'toggle' });
    expect(itemOf('nested.depth')).toMatchObject({ value: 1, control: { kind: 'number', min: 0, max: 3 } });
    expect(itemOf('mood')?.visible).toBe(false);
  });

  it('marks a sourced item custom and not settable, and hides a password value', async () => {
    await publish(true);
    expect(itemOf('project.name')).toMatchObject({ source: 'custom', settable: false, value: 'demo' });
    expect(itemOf('token')).not.toHaveProperty('value');
  });
});

describe('settings.set', () => {
  it('refuses before the settings are loaded', async () => {
    await publish(false);
    expect(settingsApi.set('theme', 'light')).toMatchObject({ ok: false, why: 'not-ready' });
  });

  it('writes a valid value', async () => {
    await publish(true);
    expect(settingsApi.set('theme', 'light')).toEqual({ ok: true });
    expect(store.getState().settings.theme).toBe('light');
  });

  it('writes a nested key', async () => {
    await publish(true);
    expect(settingsApi.set('nested.depth', 2)).toEqual({ ok: true });
    expect(store.getState().settings.nested).toEqual({ depth: 2 });
  });

  it('writes a toggle and a list', async () => {
    await publish(true);
    expect(settingsApi.set('notify', false)).toEqual({ ok: true });
    expect(settingsApi.set('tags', ['x', 'y'])).toEqual({ ok: true });
    expect(store.getState().settings).toMatchObject({ notify: false, tags: ['x', 'y'] });
  });

  it('rejects an unknown key', async () => {
    await publish(true);
    expect(settingsApi.set('nope', 1)).toMatchObject({ ok: false, why: 'unknown' });
  });

  it('rejects a value outside the choices, a disabled choice and a wrong type', async () => {
    await publish(true);
    expect(settingsApi.set('theme', 'blue')).toMatchObject({ ok: false, why: 'invalid' });
    expect(settingsApi.set('theme', 'neon')).toMatchObject({ ok: false, why: 'invalid' });
    expect(settingsApi.set('theme', 3)).toMatchObject({ ok: false, why: 'invalid' });
    expect(settingsApi.set('notify', 'yes')).toMatchObject({ ok: false, why: 'invalid' });
    expect(settingsApi.set('tags', 'x')).toMatchObject({ ok: false, why: 'invalid' });
    expect(store.getState().settings).toMatchObject({ theme: 'dark', notify: true });
  });

  it('rejects a number outside its range', async () => {
    await publish(true);
    expect(settingsApi.set('volume', 11)).toMatchObject({ ok: false, why: 'invalid' });
    expect(settingsApi.set('volume', Number.NaN)).toMatchObject({ ok: false, why: 'invalid' });
    expect(settingsApi.set('volume', 10)).toEqual({ ok: true });
  });

  it('rejects a key that belongs to another value source', async () => {
    await publish(true);
    expect(settingsApi.set('project.name', 'x')).toMatchObject({ ok: false, why: 'scope' });
    expect(extra.get('project.name')).toBe('demo');
  });
});
