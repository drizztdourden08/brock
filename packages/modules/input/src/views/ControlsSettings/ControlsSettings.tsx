/* @layer renderer-components @kind component */
import { SearchAnchor } from '@drizztdourden08/brock-react';
import { Flex } from '@drizztdourden08/tessera/primitives';
import { useControlsNarrow } from './behavior/useControlsNarrow';
import { useControlsSettings } from './behavior/useControlsSettings';
import { BindingListener } from './sub-components/BindingListener';
import { ControlsDevices } from './sub-components/ControlsDevices';
import { ControlsDialogs } from './sub-components/ControlsDialogs';
import { ControlsMain }from './sub-components/ControlsMain';
import { ControlsProfiles } from './sub-components/ControlsProfiles';
import type { ControlsSettingsProps } from './ControlsSettings.type';
import './ControlsSettings.css';

const ControlsSettings = (props: ControlsSettingsProps) => {
  const narrow = useControlsNarrow();
  const ctrl = useControlsSettings(props);
  const { labels, setDeleteTarget } = ctrl;

  return (
    <Flex gap="md" align="stretch" className="controls-settings">
      <SearchAnchor anchor="input-profiles" className="controls-settings__anchor">
        <ControlsProfiles
          profiles={ctrl.profiles}
          activeId={ctrl.activeProfile?.id ?? null}
          newlyCreatedId={ctrl.newlyCreatedId}
          labels={labels}
          narrow={narrow}
          onSelect={ctrl.selectProfile}
          onDelete={setDeleteTarget}
          onRename={ctrl.handleRename}
          onCreate={ctrl.handleCreate}
        />
      </SearchAnchor>
      <SearchAnchor anchor="bindings" className="controls-settings__anchor controls-settings__anchor--main">
        <ControlsMain tabs={props.game.tabs} ctrl={ctrl} />
      </SearchAnchor>
      <SearchAnchor anchor="devices" className="controls-settings__anchor">
        <ControlsDevices
          devices={ctrl.devices}
          controllerGroups={ctrl.controllerGroups}
          labels={labels}
          narrow={narrow}
          isRescanPending={ctrl.isRescanPending}
          onRescan={ctrl.handleRescan}
          onPreset={setConfirmPreset}
          onAddMapping={ctrl.addMapping}
        />
      </SearchAnchor>

      {ctrl.listeningFor && ctrl.listeningName && (
        <BindingListener
          actionLabel={ctrl.listeningName}
          prompt={labels.listenerPrompt}
          hint={labels.listenerHint}
          onCapture={ctrl.handleCapture}
          onCancel={ctrl.cancelListening}
        />
      )}

      <ControlsDialogs ctrl={ctrl} />
    </Flex>
  );
};

export { ControlsSettings };
