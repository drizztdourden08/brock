/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { DisabledOverlay } from '@drizztdourden08/tessera/composites';
import { bindingColumnCount } from '../behavior/binding-column-count';
import { MIN_PROFILE_BINDING_COLUMNS } from '../ControlsSettings.constants';
import { ActionRowsList } from './ActionRowsList';
import { BindingSection } from './BindingSection';
import type { ActionsTabProps } from './ActionsTab.type';

const ActionsTab = ({ tab, ctrl }: ActionsTabProps) => {
  const { labels, handleActionRebind, handleActionClear, handleGlobalClear } = ctrl;
  const isGlobal = tab.scope === 'global';
  const rows = isGlobal ? ctrl.globalRowsFor(tab.actions) : ctrl.rowsFor(tab.actions);
  const columns = bindingColumnCount(rows, isGlobal ? 1 : MIN_PROFILE_BINDING_COLUMNS);

  const handleRebind = useCallback(
    (actionId: string, slot: number) => handleActionRebind(tab.scope, actionId, slot),
    [handleActionRebind, tab.scope],
  );
  const handleClear = useCallback((actionId: string, mappingIndex: number) => {
    if (isGlobal) handleGlobalClear(actionId);
    else handleActionClear(actionId, mappingIndex);
  }, [isGlobal, handleGlobalClear, handleActionClear]);

  const list = <ActionRowsList tab={tab} rows={rows} columns={columns} labels={labels} onRebind={handleRebind} onClear={handleClear} />;
  const gate = tab.gate;
  const drop = tab.acceptsDeviceDrop
    ? { onDragOver: ctrl.handleDragOver, onDragLeave: ctrl.handleDragLeave, onDrop: ctrl.handleDrop }
    : {};

  return (
    <BindingSection title={tab.title} dragOver={tab.acceptsDeviceDrop && ctrl.dragOverBindings} {...drop}>
      {gate ? (
        <DisabledOverlay active={gate.active} message={gate.message} contained onOpenSettings={gate.onOpenSettings}>
          {list}
        </DisabledOverlay>
      ) : list}
    </BindingSection>
  );
};

export { ActionsTab };
