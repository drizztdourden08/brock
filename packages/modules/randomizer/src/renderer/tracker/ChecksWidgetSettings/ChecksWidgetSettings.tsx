/* @layer renderer-shell @kind component */
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';

const ChecksWidgetSettings = () => {
  const Settings = useRandomizerGame()?.views?.checksWidget?.settings;
  return Settings ? <Settings /> : null;
};

export { ChecksWidgetSettings };
