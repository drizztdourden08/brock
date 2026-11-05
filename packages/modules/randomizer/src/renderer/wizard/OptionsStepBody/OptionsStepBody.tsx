/* @layer renderer-shell @kind component */
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { OptionsPanel } from '../../options/OptionsPanel';
import { formOf } from '../form-of';
import { PANEL_TITLE } from './OptionsStepBody.constants';
import type { OptionsStepBodyProps } from './OptionsStepBody.type';

const OptionsStepBody = (props: OptionsStepBodyProps) => {
  const { value, values, onChange } = props;
  const GameBody = useRandomizerGame()?.views?.optionsStep;
  if (GameBody) return <GameBody {...props} />;
  return <OptionsPanel title={PANEL_TITLE} overrides={value.overrides} seed={formOf(values).seed} onChange={(overrides) => onChange({ overrides })} />;
};

export { OptionsStepBody };
