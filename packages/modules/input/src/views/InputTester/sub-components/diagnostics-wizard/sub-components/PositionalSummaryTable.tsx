/* @layer renderer-shell @kind component */
import { Icon, Table, TableCell, TableRow, TableSection } from '@drizztdourden08/tessera/primitives';
import { recordOutcomeOf } from '../positional-capture/record-outcome-of';
import { OUTCOME_ICONS } from '../positional-capture/positional-capture.constants';
import type { PositionalSummaryTableProps } from './diagnostics-steps.type';
import './PositionalSummaryTable.css';

const PositionalSummaryTable = (props: PositionalSummaryTableProps) => {
  const { records } = props;

  return (
    <Table striped aria-label="Positional capture" className="pos-summary">
      <TableSection head>
        <TableRow>
          <TableCell header>Input</TableCell>
          <TableCell header>Fired</TableCell>
          <TableCell header>Result</TableCell>
        </TableRow>
      </TableSection>
      <TableSection>
        {records.map((record) => {
          const outcome = recordOutcomeOf(record);
          return (
            <TableRow key={record.id} className="pos-summary__row" data-outcome={outcome.kind}>
              <TableCell>{record.askedLabel}</TableCell>
              <TableCell className="pos-summary__fired">{record.firedPositionalName ?? '-'}</TableCell>
              <TableCell className="pos-summary__outcome">
                <Icon name={OUTCOME_ICONS[outcome.kind]} /> {outcome.text}
              </TableCell>
            </TableRow>
          );
        })}
      </TableSection>
    </Table>
  );
};

export { PositionalSummaryTable };
