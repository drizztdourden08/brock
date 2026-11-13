/* @layer renderer-components @kind component */
import { useState } from 'react';
import { SearchAnchor } from '@drizztdourden08/brock-react';
import { Flex } from '@drizztdourden08/tessera/primitives';
import { useControlsNarrow } from './behavior/useControlsNarrow';
import { useControlsSettings } from './behavior/useControlsSettings';
import { ControlsDevices } from './sub-components/ControlsDevices';
import { ControlsDialogs } from './sub-components/ControlsDialogs';
import { ControlsListener } from './sub-components/ControlsListener';
import { ControlsMain } from './sub-components/ControlsMain';
import { ControlsNarrowTabs } from './sub-components/ControlsNarrowTabs';
import { ControlsProfiles } from './sub-components/ControlsProfiles';
import { NARROW_TAB_DEFAULT } from './ControlsSettings.constants';
import type { ControlsSettingsProps, NarrowTabId } from './ControlsSettings.type';
import './ControlsSettings.css';

const ControlsSettings = (props: ControlsSettingsProps) => {
  const narrow = useControlsNarrow();
  const ctrl = useControlsSettings(props);
  const [narrowTab, setNarrowTab] = useState<NarrowTabId>(NARROW_TAB_DEFAULT);
  const { labels, setDeleteTarget } = ctrl;
  const shows = (tab: NarrowTabId) => !narrow || narrowTab === tab;

  return (
    <Flex direction={narrow ? 'column' : 'row'} gap="md" align="stretch" className="controls-settings">
      {narrow && <ControlsNarrowTabs labels={labels} active={narrowTab} onChange={setNarrowTab} />}
      {shows('profiles') && (
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
      )}
      {shows('bindings') && (
        <SearchAnchor anchor="bindings" className="controls-settings__anchor controls-settings__anchor--main">
          <ControlsMain tabs={props.game.tabs} ctrl={ctrl} />
        </SearchAnchor>
      )}
      {shows('devices') && (
        <SearchAnchor anchor="devices" className="controls-settings__anchor">
          <ControlsDevices
            devices={ctrl.devices}
            extraDevices={props.game.extraDevices}
            controllerGroups={ctrl.controllerGroups}
            labels={labels}
            narrow={narrow}
            isRescanPending={ctrl.isRescanPending}
            onRescan={ctrl.handleRescan}
            onPreset={ctrl.setConfirmPreset}
            onAddMapping={ctrl.addMapping}
          />
        </SearchAnchor>
      )}

      <ControlsListener game={props.game} ctrl={ctrl} />
      <ControlsDialogs ctrl={ctrl} />
    </Flex>
  );
};

export { ControlsSettings };
