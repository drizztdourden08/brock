/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { DisabledOverlay } from '@drizztdourden08/tessera/composites';
import { ActionBindingRow } from './ActionBindingRow';
import { BindingListHeader } from './BindingListHeader';
import { BindingSection } from './BindingSection';
import { ReservedBindingRow } from './ReservedBindingRow';
import type { ActionsTabProps } from './ActionsTab.type';

const ActionsTab = ({ tab, ctrl }: ActionsTabProps) => {
  const { labels, handleActionRebind, handleActionClear, handleGlobalClear } = ctrl;
  const isGlobal = tab.scope === 'global';
  const rows = isGlobal ? ctrl.globalRowsFor(tab.actions) : ctrl.rowsFor(tab.actions);
  const rowLabels = { rebind: labels.rebindHint, clear: labels.clearBinding };

  const handleRebind = useCallback(
    (actionId: string) => handleActionRebind(tab.scope, actionId),
    [handleActionRebind, tab.scope],
  );
  const handleClear = useCallback((actionId: string, mappingIndex: number) => {
    if (isGlobal) handleGlobalClear(actionId);
    else handleActionClear(actionId, mappingIndex);
  }, [isGlobal, handleGlobalClear, handleActionClear]);

  const list = (
    <>
      <BindingListHeader actionLabel={labels.actionHeader} bindingLabel={labels.bindingHeader} middleLabel={tab.middleLabel} />
      {rows.map((row) => (
        <ActionBindingRow
          key={`${row.action.id}-${row.mappingIndex}`}
          action={row.action}
          mappingIndex={row.mappingIndex}
          binding={row.binding}
          bindingIcon={row.icon}
          deviceIconUrl={row.deviceIconUrl}
          middleLabel={tab.middleLabel}
          labels={rowLabels}
          onRebind={handleRebind}
          onClear={handleClear}
        />
      ))}
      {tab.reserved?.map((row) => <ReservedBindingRow key={row.label} row={row} title={labels.reservedHint} />)}
    </>
  );
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
