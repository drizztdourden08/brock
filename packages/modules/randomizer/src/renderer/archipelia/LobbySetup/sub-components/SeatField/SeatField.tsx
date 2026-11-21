/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Field, Select } from '@drizztdourden08/tessera/primitives';
import { ANY_SEAT, ANY_SEAT_LABEL, SEAT_LABEL } from './SeatField.constants';
import type { SeatFieldProps } from './SeatField.type';

const SeatField = ({ seats, picked, onPick, disabled }: SeatFieldProps) => {
  const text = useText();
  return (
    <Field label={text(SEAT_LABEL)}>
      <Select
        value={picked !== null && seats.includes(picked) ? picked : ANY_SEAT}
        options={[{ value: ANY_SEAT, label: text(ANY_SEAT_LABEL) }, ...seats.map((seat) => ({ value: seat, label: seat }))]}
        disabled={disabled}
        onChange={(next) => onPick(next === ANY_SEAT ? null : next)}
      />
    </Field>
  );
};

export { SeatField };
