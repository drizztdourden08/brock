/* @layer renderer-components @kind component */
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { hapticsRows } from '../behavior/haptics-rows';
import { requiredInputRows } from '../behavior/required-input-rows';
import type { OptionsTabProps } from './OptionsTab.type';

const OptionsTab = ({ tab, ctrl }: OptionsTabProps) => {
  const { labels, requiredInputs } = ctrl;
  return (
    <>
      {tab.haptics && (
        <SettingsSection id="controls-haptics" title={labels.hapticsTitle} rows={hapticsRows(tab.haptics, labels)} />
      )}
      <SettingsSection
        id="controls-required-inputs"
        title={labels.requiredInputsTitle}
        rows={requiredInputRows(requiredInputs, labels)}
      />
    </>
  );
};

export { OptionsTab };
