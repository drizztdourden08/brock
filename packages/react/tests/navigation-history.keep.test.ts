/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { restoreNavigation } from '../src/navigation/restore-navigation';
import { leaveGuards } from '../src/navigation/leave-guards';
import { nav } from '../src/navigation/nav';
import { readSavedNavigation } from '../src/navigation/read-saved-navigation';
import { resolveRoute } from '../src/navigation/resolve-route';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { useDialogStore } from '../src/stores/useDialogStore';

const state = () => useNavigationStore.getState();
const section = (): unknown => state().params.section;
const trail = (id: string): unknown[] => (state().history[id] ?? []).map((params) => params.section);
const noAlias = () => undefined;

afterEach(() => {
  useNavigationStore.getState().restore(null);
  useDialogStore.setState({ dialog: null });
});

describe('hub history', () => {
  it('keeps a page history per hub, and Back walks it', () => {
    nav.open('game');
    nav.open('game/saves');
    nav.open('game/tracker/map');
    expect(trail('game')).toEqual([undefined, 'saves']);
    expect(nav.canGoBack()).toBe(true);
    expect(nav.back()).toBe(true);
    expect(section()).toBe('saves');
    expect(nav.back()).toBe(true);
    expect(section()).toBeUndefined();
    expect(nav.back()).toBe(false);
  });

  it('does not record opening the page already shown', () => {
    nav.open('game/saves');
    nav.open('game/saves');
    expect(trail('game')).toEqual([]);
  });

});

describe('Escape and Home in a hub', () => {
  it('goes up one level on Escape, to the hub home, then closes the hub, while Back keeps the whole history', () => {
    nav.open('game');
    nav.open('game/saves');
    nav.open('game/tracker');
    nav.open('game/library');
    state().setEscapeTo({});
    nav.escape();
    expect(state().active).toBe('game');
    expect(section()).toBeUndefined();
    expect(trail('game')).toEqual([undefined, 'saves', 'tracker']);
    state().setEscapeTo(null);
    nav.escape();
    expect(state().active).toBeNull();
  });

  it('closes a hub on its home page at the first Escape, whatever the history holds', () => {
    nav.open('game/saves');
    nav.open('game');
    nav.escape();
    expect(state().active).toBeNull();
  });

  it('opens the hub home from Home, not the page the hub was left on', () => {
    nav.open('game/saves');
    nav.close();
    nav.home('game');
    expect(state().active).toBe('game');
    expect(section()).toBeUndefined();
    nav.open('game/tracker');
    nav.home('game');
    expect(section()).toBeUndefined();
    expect(trail('game')).toEqual([undefined, 'tracker']);
    nav.close();
    nav.open('data/library');
    nav.open('game');
    expect(section()).toBeUndefined();
  });

  it('keeps each hub where it was when another hub opens, and the hub switch comes back to it', () => {
    nav.open('game/saves');
    nav.open('data/library');
    nav.open('game');
    expect(section()).toBe('saves');
    nav.open('game/tracker');
    expect(trail('game')).toEqual(['saves']);
  });

  it('forgets the history on close but opens the hub on the page it was left on', () => {
    nav.open('game/saves');
    nav.open('game/tracker');
    nav.close();
    expect(state().history.game).toBeUndefined();
    nav.open('game');
    expect(section()).toBe('tracker');
    nav.open('game/saves');
    expect(section()).toBe('saves');
  });

});

describe('sub-page history', () => {
  it('goes up from a sub-page to its page, reusing the history entry when it is the page', () => {
    nav.open('game/saves');
    nav.open('game/saves/42/edit');
    expect(state().params).toMatchObject({ section: 'saves', tab: '42/edit' });
    nav.up({ section: 'saves' });
    expect(state().params.tab).toBeUndefined();
    expect(trail('game')).toEqual([]);
  });

  it('falls back to the sub-page parent when there is no history', () => {
    nav.open('game/saves/new');
    state().setParent({ section: 'saves' });
    state().setEscapeTo({ section: 'saves' });
    expect(nav.canGoBack()).toBe(true);
    nav.escape();
    expect(state().active).toBe('game');
    expect(state().params).toEqual({ section: 'saves' });
  });
});

describe('unsaved changes', () => {
  it('asks "Discard changes?" before leaving a dirty page, and stays on Keep editing', async () => {
    nav.open('game/saves/new');
    const release = leaveGuards.add(() => true);
    nav.close();
    const asked = useDialogStore.getState().dialog;
    expect(asked?.title).toBe('Discard changes?');
    asked?.onCancel?.();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    expect(state().active).toBe('game');
    nav.open('game/tracker');
    useDialogStore.getState().dialog?.onConfirm();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    release();
    expect(section()).toBe('tracker');
  });
});

describe('deep links', () => {
  it('keeps every segment after the page as the tab or sub-page path', () => {
    expect(resolveRoute('game/saves/42/edit', {}, noAlias)).toEqual({ active: 'game', params: { section: 'saves', tab: '42/edit' } });
  });
});

describe('restoring navigation', () => {
  const known = (id: string) => ['game', 'data'].includes(id);

  it('reads a saved state and drops screens the app no longer has', () => {
    const saved = readSavedNavigation({ active: 'gone', params: { section: 'x' }, history: { game: [{ section: 'a' }, 'junk'], gone: [] }, remembered: { data: { section: 'library' } } }, known);
    expect(saved).toEqual({ active: null, params: {}, history: { game: [{ section: 'a' }] }, remembered: { data: { section: 'library' } } });
    expect(readSavedNavigation('nope', known)).toBeNull();
  });

  it('puts back the open hub, its page and history over the startup home, but not over a screen the user opened', () => {
    nav.open('game');
    restoreNavigation({ active: 'data', params: { section: 'sources' }, history: { data: [{ section: 'library' }] }, remembered: {} }, 'game');
    expect(state().active).toBe('data');
    expect(nav.canGoBack()).toBe(true);
    nav.open('game/saves');
    restoreNavigation({ active: 'data', params: {}, history: {}, remembered: { data: { section: 'library' } } }, 'game');
    expect(state().active).toBe('game');
    expect(state().remembered.data).toEqual({ section: 'library' });
  });
});
