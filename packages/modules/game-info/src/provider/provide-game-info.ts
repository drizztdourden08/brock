/* @layer renderer-shell @kind logic */
import type { GameInfoProvider } from './provider.type';
import { useProviderStore } from './useProviderStore';

const provideGameInfo = <S>(provider: GameInfoProvider<S>): void => {
  useProviderStore.setState({ provider: provider as unknown as GameInfoProvider<never> });
};

export { provideGameInfo };
