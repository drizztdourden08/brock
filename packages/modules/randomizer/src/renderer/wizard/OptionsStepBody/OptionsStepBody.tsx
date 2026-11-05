/* @layer renderer-shell @kind component */
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { OptionsPanel } from '../../options/OptionsPanel';
import { formOf } from '../form-of';
import { PANEL_TITLE } from './OptionsStepBody.constants';
import type { OptionsStepBodyProps } from './OptionsStepBody.type';

const OptionsStepBody = (props: OptionsStepBodyProps) => {
  const { value, values, subStep, onSubStepChange, onChange } = props;
  const GameBody = useRandomizerGame()?.views?.optionsStep;
  if (GameBody) return <GameBody {...props} />;
  return (
    <OptionsPanel
      title={PANEL_TITLE}
      overrides={value.overrides}
      seed={formOf(values).seed}
      tab={subStep}
      onTabChange={onSubStepChange}
      onChange={(overrides) => onChange({ overrides })}
    />
  );
};

export { OptionsStepBody };
