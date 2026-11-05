/* @layer renderer-shell @kind component */
import { useWidgetPref } from '@drizztdourden08/brock-react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { GAME_INFO_WIDGET_ID } from '../../../game-info.constants';
import { descPrefKey } from '../behavior/desc-pref-key';
import type { DescribedRowProps } from './DescribedRow.type';

const DescribedRow = ({ row }: DescribedRowProps) => {
  const [open, setOpen] = useWidgetPref<boolean>(GAME_INFO_WIDGET_ID, descPrefKey(row.label), false);
  return (
    <Box className="game-info-described">
      <Box className="game-info-described__line">
        <Text tone="muted" className="game-info-described__label" onClick={() => setOpen(!open)}>{row.label}</Text>
        <Box className="game-info-described__value">
          <Text tone={row.tone}>{row.value}</Text>
          {row.badge !== undefined && <Text mono tone="faint">{row.badge}</Text>}
        </Box>
      </Box>
      {open && <Box className="game-info-described__body">{row.description}</Box>}
    </Box>
  );
};

export { DescribedRow };
