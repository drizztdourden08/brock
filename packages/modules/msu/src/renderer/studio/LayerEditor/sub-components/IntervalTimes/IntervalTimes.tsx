/* @layer renderer-shell @kind component */
import { useT } from '@drizztdourden08/brock-react';
import { useState } from 'react';
import { Status, Box, Button, Field, Flex, IconButton, NumberInput, Text } from '@drizztdourden08/tessera/primitives';
import type { IntervalTimesProps } from './IntervalTimes.type';

const IntervalTimes = (props: IntervalTimesProps) => {
  const { atSeconds, disabled = false, onChange } = props;
  const t = useT();
  const [draft, setDraft] = useState(0);

  const add = () => {
    if (!Number.isFinite(draft) || draft < 0 || atSeconds.includes(draft)) return;
    onChange([...atSeconds, draft].sort((a, b) => a - b));
    setDraft(0);
  };

  return (
    <Box className="layer-card__intervals">
      <Flex gap="xs" align="center" wrap>
        {atSeconds.length === 0 && <Text variant="caption">{t('msu:interval.none')}</Text>}
        {atSeconds.map((seconds) => (
          <Flex key={seconds} gap="xs" align="center" className="layer-card__interval">
            <Status tone="neutral">{seconds}s</Status>
            <IconButton
              variant="ghost"
              size="sm"
              label={t('msu:interval.remove', { seconds })}
              disabled={disabled}
              onClick={() => onChange(atSeconds.filter((s) => s !== seconds))}
            >
              ✕
            </IconButton>
          </Flex>
        ))}
      </Flex>
      <Flex gap="sm" align="end">
        <Field label={t('msu:interval.addLabel')}>
          <NumberInput
            min={0} step={0.25} max={3600} sizeToContent value={draft} disabled={disabled}
            onChange={(value) => setDraft(Number.isFinite(value) ? value : 0)}
          />
        </Field>
        <Button variant="secondary" size="sm" disabled={disabled} onClick={add}>{t('msu:interval.add')}</Button>
      </Flex>
    </Box>
  );
};

export { IntervalTimes };
