/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { revealWithToast } from '../src/settings/SettingsLayout/sub-components/SettingPathField/behavior/reveal-with-toast';

const toasts = vi.hoisted(() => [] as string[]);

vi.mock('../src/toast/toast', () => ({ toast: (message: string) => { toasts.push(message); } }));

describe('revealWithToast', () => {
  it('gives PathInput no reveal when the host cannot show a path', () => {
    expect(revealWithToast(undefined)).toBeUndefined();
  });

  it('reveals through the platform and says when it could not', async () => {
    const reveal = vi.fn((path: string) => Promise.resolve(path.endsWith('gone.gb') ? { success: false as const, error: 'missing' } : { success: true as const }));
    const onReveal = revealWithToast(reveal);
    onReveal?.('C:/roms/game.gb');
    onReveal?.('C:/roms/gone.gb');
    await vi.waitFor(() => expect(toasts).toEqual(['Could not show C:/roms/gone.gb: missing']));
    expect(reveal.mock.calls).toEqual([['C:/roms/game.gb'], ['C:/roms/gone.gb']]);
  });
});
