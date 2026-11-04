/* @layer renderer-shell @kind component */
import { useProviderStore } from '../../provider/useProviderStore';
import { useGameInfoDisabled } from '../../runtime/useGameInfoDisabled';
import { useGameInfoView } from '../../runtime/useGameInfoView';
import { useGameInfoPrefs } from './behavior/useGameInfoPrefs';
import { useVisibleSections } from './behavior/useVisibleSections';
import { CompactView } from './CompactView';
import { FullView } from './FullView';
import { GameInfoEmpty } from './sub-components/GameInfoEmpty';
import { GameInfoLocked } from './sub-components/GameInfoLocked';
import './GameInfoWidget.css';

const GameInfoWidget = () => {
  const provider = useProviderStore((s) => s.provider);
  const gate = useGameInfoDisabled();
  const prefs = useGameInfoPrefs();
  const { blocks, compact, customHidden } = useGameInfoView();
  const sections = useVisibleSections(prefs, blocks, compact);

  if (gate) return <GameInfoLocked reason={gate.message} />;
  if (!provider || sections.length === 0) return <GameInfoEmpty text={provider?.emptyText} />;
  const View = prefs.view === 'compact' ? CompactView : FullView;
  return <View sections={sections} prefs={prefs} customHidden={customHidden} />;
};

export { GameInfoWidget };
