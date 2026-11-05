/* @layer renderer-shell @kind component */
import { Box, Shortcut, Text } from '@drizztdourden08/tessera/primitives';
import { shortcutOf } from './behavior/shortcut-of';
import type { ControlLegendProps } from './ControlLegend.type';
import './ControlLegend.css';

const ControlLegend = ({ items, label = 'Controls', className = '' }: ControlLegendProps) => (
  <Box className={`control-legend ${className}`.trim()} role="list" aria-label={label}>
    {items.map((item) => (
      <Box key={`${item.glyph}-${item.label}`} className="control-legend__item" role="listitem">
        <Shortcut size="xs" {...shortcutOf(item)} />
        <Text className="control-legend__label">{item.label}</Text>
      </Box>
    ))}
  </Box>
);

export { ControlLegend };
