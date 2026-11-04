/* @layer renderer-shell @kind logic */
import type { GameInfoProvider, GameInfoSection } from './provider.type';
import { useProviderStore } from './useProviderStore';

const widen = <S>(section: GameInfoSection<S>): GameInfoSection<unknown> => {
  const { compact } = section;
  return {
    ...section,
    blocks: (snapshot) => section.blocks(snapshot as S),
    compact: compact ? (snapshot) => compact(snapshot as S) : undefined,
  };
};

const provideGameInfo = <S>(provider: GameInfoProvider<S>): void => {
  useProviderStore.setState({ provider: { ...provider, sections: provider.sections.map(widen) } });
};

export { provideGameInfo };
