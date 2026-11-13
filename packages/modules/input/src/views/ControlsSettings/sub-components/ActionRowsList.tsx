/* @layer renderer-components @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { ActionBindingRow } from './ActionBindingRow';
import { ActionListHeader } from './ActionListHeader';
import { ReservedBindingRow } from './ReservedBindingRow';
import type { ActionRowsListProps } from './ActionRowsList.type';

const ActionRowsList = ({ tab, rows, columns, labels, onRebind, onClear }: ActionRowsListProps) => {
  const rowLabels = { rebind: labels.rebindHint, clear: labels.clearBinding };
  return (
    <Box className={`action-grid action-grid--cols-${columns}`}>
      <ActionListHeader actionLabel={labels.actionHeader} bindingLabel={labels.bindingHeader} middleLabel={tab.middleLabel} columns={columns} />
      {tab.reserved?.map((row) => <ReservedBindingRow key={row.label} row={row} title={labels.reservedHint} />)}
      {rows.map((row) => (
        <ActionBindingRow
          key={row.action.id}
          row={row}
          columns={columns}
          middleLabel={tab.middleLabel}
          labels={rowLabels}
          onRebind={onRebind}
          onClear={onClear}
        />
      ))}
    </Box>
  );
};

export { ActionRowsList };
