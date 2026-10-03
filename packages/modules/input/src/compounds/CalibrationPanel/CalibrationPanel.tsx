/* @layer renderer-shell @kind component */
import { useId, useMemo } from 'react';
import { PressedGrid } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Flex, Paragraph, Span, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { CalibrationMeter } from './sub-components/CalibrationMeter';
import { InputGlyph } from './sub-components/InputGlyph';
import { buttonItems } from './behavior/button-items';
import { CALIBRATION_PANEL_TEXT, DEFAULT_INPUT_FAMILY } from './CalibrationPanel.constants';
import type { CalibrationPanelProps } from './CalibrationPanel.type';
import './CalibrationPanel.css';

const CalibrationPanel = (props: CalibrationPanelProps) => {
  const {
    title, instruction, reading, buttons, family = DEFAULT_INPUT_FAMILY, readout, action, onCancel, cancelLabel = CALIBRATION_PANEL_TEXT.cancel,
    children, className = '',
  } = props;
  const titleId = useId();
  const items = useMemo(() => buttonItems(buttons?.items ?? [], family), [buttons?.items, family]);

  return (
    <Stack as="section" gap="sm" aria-labelledby={titleId} className={`calibration-panel${className ? ` ${className}` : ''}`}>
      <Flex align="center" gap="sm">
        {reading && <InputGlyph family={family} kind={reading.kind} name={reading.name} label={reading.label} />}
        <Text as="h4" id={titleId} className="calibration-panel__title">{title}</Text>
      </Flex>
      <Paragraph tone="muted" className="calibration-panel__instruction">{instruction}</Paragraph>
      {reading && <CalibrationMeter reading={reading} />}
      {readout != null && <Span tone="dim" className="calibration-panel__readout">{readout}</Span>}
      {buttons && (
        <Stack gap="xs" className="calibration-panel__buttons">
          <Span tone="dim" className="calibration-panel__label">{CALIBRATION_PANEL_TEXT.buttons}</Span>
          <PressedGrid family={family} items={items} pressed={buttons.pressed} />
        </Stack>
      )}
      {children}
      <ButtonRow>
        <Button variant="ghost" size="sm" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant="primary" size="sm" disabled={action.disabled} onClick={action.onClick}>{action.label}</Button>
      </ButtonRow>
    </Stack>
  );
};

export { CalibrationPanel };
