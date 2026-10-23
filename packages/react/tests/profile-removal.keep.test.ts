/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Profile } from '@drizztdourden08/brock-core';
import type { EscapeStack } from '@drizztdourden08/tessera/primitives';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import { handleShellKey } from '../src/app/BrockApp/behavior/handle-shell-key';
import { profilelessEscape } from '../src/app/BrockApp/behavior/profileless-escape';
import { profilesAlias } from '../src/app/BrockApp/behavior/profiles-alias';
import { profilesTask } from '../src/boot/tasks/profiles-task';
import type { MenuItem } from '../src/menu/menu.type';
import { nav } from '../src/navigation/nav';
import { routeAliases } from '../src/navigation/route-aliases';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { profileRemoval } from '../src/stores/profile-removal';
import { PROFILES_SCREEN } from '../src/stores/profiles.constants';
import { removeProfile } from '../src/stores/remove-profile';
import { useProfilesStore } from '../src/stores/useProfilesStore';

const disk = vi.hoisted(() => ({ profiles: [] as Profile[], removed: [] as string[] }));

vi.mock('../src/profiles/list-profiles', () => ({
  listProfiles: () => Promise.resolve([...disk.profiles].sort((a, b) => b.lastPlayed - a.lastPlayed)),
}));
vi.mock('../src/profiles/delete-profile', () => ({
  deleteProfile: (id: string) => {
    disk.removed.push(id);
    disk.profiles = disk.profiles.filter((profile) => profile.id !== id);
    return Promise.resolve();
  },
}));
vi.mock('../src/profiles/get-app-state', () => ({ getAppState: () => Promise.resolve({ lastProfileId: null }) }));
vi.mock('../src/profiles/set-last-profile', () => ({ setLastProfile: () => Promise.resolve() }));
vi.mock('../src/profiles/touch-profile', () => ({ touchProfile: () => Promise.resolve() }));

const profile = (id: string, lastPlayed: number): Profile => ({ id, name: `Profile ${id}`, created: 0, lastPlayed });

const OLDEST = profile('a', 1);
const NEWEST = profile('b', 3);
const MIDDLE = profile('c', 2);

const start = async (profiles: Profile[], active: Profile | null): Promise<void> => {
  disk.profiles = [...profiles];
  disk.removed = [];
  await useProfilesStore.getState().refresh();
  useProfilesStore.getState().setActive(active);
};

const removals: (() => void)[] = [];

const profileAlias = (route: string): (() => void) => {
  const alias = profilesAlias(route);
  return alias ? routeAliases.add(PROFILES_SCREEN, alias) : () => undefined;
};

const escapes: EscapeStack = { depth: () => 0, top: () => null };

const pressEscape = (): void => {
  const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
  handleShellKey(event, { home: profilelessEscape.home, holds: profilelessEscape.holds, escapes });
};

beforeEach(() => {
  useNavigationStore.getState().restore(null);
});

afterEach(() => {
  for (const remove of removals.splice(0)) remove();
  useProfilesStore.getState().setActive(null);
});

describe('removing a profile', () => {
  it('activates the most recently used profile left when the active one goes, and stays where the user is', async () => {
    await start([OLDEST, NEWEST, MIDDLE], OLDEST);
    nav.open('settings');
    expect(await removeProfile(OLDEST)).toBe(true);
    expect(useProfilesStore.getState().active?.id).toBe('b');
    expect(useProfilesStore.getState().profiles.map((p) => p.id)).toEqual(['b', 'c']);
    expect(nav.active()).toBe('settings');
  });

  it('opens the profiles screen when the last profile goes', async () => {
    await start([OLDEST], OLDEST);
    await removeProfile(OLDEST);
    expect(useProfilesStore.getState().active).toBeNull();
    expect(nav.active()).toBe(PROFILES_SCREEN);
  });

  it('opens the route the app names for profiles when the last profile goes', async () => {
    removals.push(profileAlias('data/profiles'));
    await start([OLDEST], OLDEST);
    await removeProfile(OLDEST);
    const { active, params } = useNavigationStore.getState();
    expect([active, params.section]).toEqual(['data', 'profiles']);
  });

  it('leaves the active profile and the screen alone when another profile goes', async () => {
    await start([OLDEST, NEWEST], NEWEST);
    nav.open('settings');
    await removeProfile(OLDEST);
    expect(useProfilesStore.getState().active?.id).toBe('b');
    expect(disk.removed).toEqual(['a']);
    expect(nav.active()).toBe('settings');
  });
});

describe('the app hook before a removal', () => {
  it('keeps the profile when the hook says no, even after waiting', async () => {
    const asked: string[] = [];
    removals.push(profileRemoval.add(async (target) => {
      asked.push(target.id);
      await Promise.resolve();
      return false;
    }));
    await start([OLDEST, NEWEST], OLDEST);
    expect(await removeProfile(OLDEST)).toBe(false);
    expect(asked).toEqual(['a']);
    expect(disk.removed).toEqual([]);
    expect(useProfilesStore.getState().active?.id).toBe('a');
  });

  it('keeps the profile when the hook throws, and removes it when the hook returns nothing', async () => {
    const stop = profileRemoval.add(() => { throw new Error('still running'); });
    await start([OLDEST, NEWEST], NEWEST);
    expect(await removeProfile(OLDEST)).toBe(false);
    stop();
    removals.push(profileRemoval.add(() => undefined));
    expect(await removeProfile(OLDEST)).toBe(true);
    expect(disk.removed).toEqual(['a']);
  });
});

describe('Escape with no profile', () => {
  it('opens the profiles route when nothing is open', async () => {
    await start([], null);
    pressEscape();
    expect(nav.active()).toBe(PROFILES_SCREEN);
  });

  it('stays on the profiles route instead of closing it to an empty window', async () => {
    removals.push(profileAlias('data/profiles'));
    await start([], null);
    nav.open(PROFILES_SCREEN);
    pressEscape();
    pressEscape();
    const { active, params } = useNavigationStore.getState();
    expect([active, params.section]).toEqual(['data', 'profiles']);
  });

  it('closes another screen, then opens the profiles route', async () => {
    await start([], null);
    nav.open('about');
    pressEscape();
    expect(nav.active()).toBeNull();
    pressEscape();
    expect(nav.active()).toBe(PROFILES_SCREEN);
  });

  it('changes nothing while a profile is active', async () => {
    await start([NEWEST], NEWEST);
    expect(profilelessEscape.home()).toBeNull();
    nav.open(PROFILES_SCREEN);
    expect(profilelessEscape.holds()).toBe(false);
    pressEscape();
    expect(nav.active()).toBeNull();
  });
});

describe('the paths to profiles with no profile', () => {
  it('sends the boot picker to the route the app names', async () => {
    removals.push(profileAlias('data/profiles'));
    await start([], null);
    await profilesTask.run({ report: vi.fn(), product: {} } as never);
    const { active, params } = useNavigationStore.getState();
    expect([active, params.section]).toEqual(['data', 'profiles']);
  });

  it('shows Home as disabled with the reason while it needs a profile', () => {
    const noop = (): void => undefined;
    const input = { appMenu: [], moduleMenu: [], widgets: [], homeScreen: 'game', hasCredits: false, developerTools: false, onQuit: noop, onDevConsole: noop, onReportBug: noop, onShortcuts: noop };
    const home = (homeLocked: boolean): MenuItem | undefined =>
      buildMenu({ ...input, homeLocked }).find((entry): entry is MenuItem => entry !== 'separator' && entry.key === 'home');
    expect(home(true)).toMatchObject({ screen: 'game', disabled: true, description: 'Pick or create a profile first' });
    expect(home(false)?.disabled).toBeUndefined();
  });
});
