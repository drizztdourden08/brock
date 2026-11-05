/* @layer renderer-components @kind component */
import { Box, Button, Icon, Text } from '@drizztdourden08/tessera/primitives';
import { BindingListHeader } from './BindingListHeader';
import { BindingSection } from './BindingSection';
import { SlotRow } from './SlotRow';
import { VerbGroups } from './VerbGroups';
import type { VerbsTabProps } from './VerbsTab.type';
import './VerbsTab.css';

const VerbsTab = ({ tab, ctrl }: VerbsTabProps) => {
  const { labels, slots } = ctrl;
  const rowLabels = { rebind: labels.rebindHint, clear: labels.clearBinding };
  const headers = { action: labels.verbsHeader, group: labels.groupHeader, binding: labels.bindingHeader };
  const assignmentOf = (index: number) => tab.slots?.assignmentLabel?.(index) ?? '';

  return (
    <BindingSection
      dragOver={ctrl.dragOverBindings}
      onDragOver={ctrl.handleDragOver}
      onDragLeave={ctrl.handleDragLeave}
      onDrop={ctrl.handleDrop}
    >
      <VerbGroups
        groups={tab.groups}
        verbs={ctrl.verbs}
        bindings={ctrl.verbBindings}
        icons={ctrl.verbIcons}
        headers={headers}
        labels={rowLabels}
        onRebind={ctrl.handleVerbRebind}
      />
      {tab.slots && (
        <>
          <Box className="verbs-tab__slots-head"><Text className="verbs-tab__slots-title">{labels.slotsTitle}</Text></Box>
          {labels.slotsHint && <Text variant="caption" className="verbs-tab__slots-hint">{labels.slotsHint}</Text>}
          <BindingListHeader actionLabel={labels.slotHeader} middleLabel={labels.assignmentHeader} bindingLabel={labels.bindingHeader} />
          {slots.map((slot) => (
            <SlotRow
              key={slot.index}
              slot={slot}
              assignment={assignmentOf(slot.index)}
              labels={rowLabels}
              removeLabel={labels.removeSlot}
              onRebind={ctrl.handleSlotRebind}
              onRemove={ctrl.handleRemoveSlot}
            />
          ))}
          {slots.length === 0 && (
            <Text as="p" className="verbs-tab__empty">{ctrl.hasSlotSource ? labels.noSlots : labels.emptySlotsHint}</Text>
          )}
          <Box className="verbs-tab__add">
            <Button variant="ghost" size="sm" icon={<Icon name="plus" />} onClick={ctrl.handleAddSlot}>{labels.addSlot}</Button>
          </Box>
          {tab.slots.footer?.(ctrl.context)}
        </>
      )}
    </BindingSection>
  );
};

export { VerbsTab };
