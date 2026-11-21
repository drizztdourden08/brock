/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { OptionGroup } from '@drizztdourden08/tessera/composites';
import { RandomizerOptionRow } from '../RandomizerOptionRow';
import type { OptionGroupListProps } from './OptionGroupList.type';

const OptionGroupList = (props: OptionGroupListProps) => {
  const text = useText();
  const { groups, valueOf, cellOf, live = false, frozen = false, notes, onRowChange, readout } = props;

  return (
    <>
      {groups.map(({ id, label, options }) => (
        <OptionGroup key={id} title={text(label)} tone={live ? 'live' : 'default'}>
          {options.map((option) => (
            <RandomizerOptionRow
              key={option.key}
              option={option}
              value={valueOf(option)}
              impact={cellOf?.(option.key)}
              readout={readout}
              disabled={frozen}
              note={notes?.get(option.key)}
              onChange={onRowChange === undefined ? undefined : (next) => onRowChange(option.key, next)}
            />
          ))}
        </OptionGroup>
      ))}
    </>
  );
};

export { OptionGroupList };
