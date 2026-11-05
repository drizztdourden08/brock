/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { SearchAnchor } from '@drizztdourden08/brock-react';
import { Dialog } from '@drizztdourden08/tessera/composites';
import { Flex } from '@drizztdourden08/tessera/primitives';
import { useControlsNarrow } from './behavior/useControlsNarrow';
import { useControlsSettings } from './behavior/useControlsSettings';
import { BindingListener } from './sub-components/BindingListener';
import { ControlsDevices } from './sub-components/ControlsDevices';
import { ControlsMain } from './sub-components/ControlsMain';
import { ControlsProfiles } from './sub-components/ControlsProfiles';
import type { ControlsSettingsProps } from './ControlsSettings.type';
import './ControlsSettings.css';

const ControlsSettings = (props: ControlsSettingsProps) => {
  const narrow = useControlsNarrow();
  const ctrl = useControlsSettings(props);
  const { labels, confirmPreset, deleteTarget, setConfirmPreset, setDeleteTarget } = ctrl;
  const cancelPreset = useCallback(() => setConfirmPreset(null), [setConfirmPreset]);
  const cancelDelete = useCallback(() => setDeleteTarget(null), [setDeleteTarget]);

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

      <Dialog
        open={Boolean(confirmPreset)}
        title={labels.presetTitle}
        message={labels.presetMessage(confirmPreset?.deviceName ?? '')}
        confirmLabel={labels.presetConfirm}
        cancelLabel={labels.cancel}
        onConfirm={ctrl.handleApplyPreset}
        onCancel={cancelPreset}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        title={labels.deleteTitle}
        message={labels.deleteMessage(deleteTarget?.name ?? '')}
        variant="danger"
        confirmLabel={labels.deleteConfirm}
        cancelLabel={labels.cancel}
        onConfirm={ctrl.handleDeleteConfirm}
        onCancel={cancelDelete}
      />
    </Flex>
  );
};

export { ControlsSettings };
