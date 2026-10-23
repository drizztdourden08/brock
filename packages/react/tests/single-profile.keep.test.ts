/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Profile } from '@drizztdourden08/brock-core';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import { profilesTask } from '../src/boot/tasks/profiles-task';
import type { MenuItem } from '../src/menu/menu.type';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { createBuiltInScreens } from '../src/screens/built-in/built-in-screens';
import { DEFAULT_PROFILE_NAME, PROFILES_SCREEN } from '../src/stores/profiles.constants';
import { useProfilesStore } from '../src/stores/useProfilesStore';

const disk = vi.hoisted(() => ({ profiles: [] as Profile[] }));

vi.mock('../src/profiles/list-profiles', () => ({ listProfiles: () => Promise.resolve([...disk.profiles]) }));
vi.mock('../src/profiles/create-profile', () => ({
  createProfile: (opts: { name: string }) => {
    const created: Profile = { id: `p${disk.profiles.length + 1}`, name: opts.name, created: 0, lastPlayed: 0 };
    disk.profiles.push(created);
    return Promise.resolve(created);
  },
}));
vi.mock('../src/profiles/get-app-state', () => ({ getAppState: () => Promise.resolve({ lastProfileId: null }) }));

const run = (singleProfile: boolean): Promise<void> => profilesTask.run({ report: vi.fn(), product: { singleProfile } } as never) as Promise<void>;

const noop = (): void => undefined;
const menuInput = { appMenu: [], moduleMenu: [], widgets: [], homeScreen: 'editor', hasCredits: false, developerTools: false, onQuit: noop, onDevConsole: noop, onReportBug: noop, onShortcuts: noop };
const keys = (singleProfile: boolean): string[] =>
  buildMenu({ ...menuInput, singleProfile }).filter((entry): entry is MenuItem => entry !== 'separator').map((entry) => entry.key);

beforeEach(() => {
  disk.profiles = [];
  useNavigationStore.getState().restore(null);
});

afterEach(() => useProfilesStore.getState().setActive(null));

describe('product.singleProfile', () => {
  it('creates one default profile silently on the first launch and never opens the picker', async () => {
    await run(true);
    expect(disk.profiles.map((p) => p.name)).toEqual([DEFAULT_PROFILE_NAME]);
    expect(useProfilesStore.getState().active?.name).toBe(DEFAULT_PROFILE_NAME);
    expect(useNavigationStore.getState().active).toBeNull();
  });

  it('reuses the profile it made on later launches', async () => {
    await run(true);
    useProfilesStore.getState().setActive(null);
    await run(true);
    expect(disk.profiles).toHaveLength(1);
    expect(useProfilesStore.getState().active?.id).toBe('p1');
  });

  it('keeps today behaviour by default: no profile opens the picker', async () => {
    await run(false);
    expect(disk.profiles).toEqual([]);
    expect(useNavigationStore.getState().active).toBe(PROFILES_SCREEN);
  });

  it('drops the Profiles menu entry and the built-in profiles screen', () => {
    expect(keys(false)).toContain('profiles');
    expect(keys(true)).not.toContain('profiles');
    expect(createBuiltInScreens({ profiles: false }).some((screen) => screen.id === PROFILES_SCREEN)).toBe(false);
    expect(createBuiltInScreens({}).some((screen) => screen.id === PROFILES_SCREEN)).toBe(true);
  });
});
