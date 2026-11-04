/* @layer core @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { provideGameInfo } from '../src/provider/provide-game-info';
import type { GameInfoProvider } from '../src/provider/provider.type';
import { useProviderStore } from '../src/provider/useProviderStore';

const providerWith = (emptyText: string): GameInfoProvider<number> => ({
  core: { state: () => ({ status: 'idle' }), subscribe: () => () => undefined },
  gate: { get: () => null, subscribe: () => () => undefined },
  read: () => null,
  sections: [],
  emptyText,
});

describe('K1 provideGameInfo', { tags: ['critical'] }, () => {
  beforeEach(() => { useProviderStore.setState({ provider: null }); });

  it('keeps the second provider when it is called twice', () => {
    const first = providerWith('first');
    const second = providerWith('second');
    provideGameInfo(first);
    provideGameInfo(second);
    expect(useProviderStore.getState().provider?.emptyText).toBe(second.emptyText);
  });
});
