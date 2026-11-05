/* @layer renderer-shell @kind component */
import { OptionsPanel } from '../../options/OptionsPanel';
import { formOf } from '../form-of';
import { PANEL_TITLE } from './OptionsStepBody.constants';
import type { OptionsStepBodyProps } from './OptionsStepBody.type';

const OptionsStepBody = (props: OptionsStepBodyProps) => {
  const { value, values, subStep, onSubStepChange, onChange } = props;
  return (
    <OptionsPanel
      title={PANEL_TITLE}
      overrides={value.overrides}
      seed={formOf(values).seed}
      mode={formOf(values).mode}
      romFile={null}
      tab={subStep}
      onTabChange={onSubStepChange}
      onChange={(overrides) => onChange({ overrides })}
    />
  );
};

export { OptionsStepBody };
