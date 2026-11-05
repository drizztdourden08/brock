/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Box, Button, Pressable, TextInput } from '@drizztdourden08/tessera/primitives';
import { useAnchorRef } from '../../hooks/useAnchorRef';
import { AnchoredCard } from '../AnchoredCard';
import { nudgeTarget } from './behavior/nudge-target';
import { NO_STEPS } from './NumberSetter.constants';
import type { NumberSetterProps } from './NumberSetter.type';
import './NumberSetter.css';

const clampTo = (min: number, max: number, n: number): number => Math.min(max, Math.max(min, Math.round(n)));

const digits = (n: number): string => String(n);

const NumberSetter = (props: NumberSetterProps) => {
  const { title, value, min, max, steps: stepList = NO_STEPS, ladder, format = digits, anchor, onCommit, onClose } = props;
  const anchorRef = useAnchorRef(anchor);
  const [draft, setDraft] = useState(String(value));
  const commit = useCallback((next: number) => {
    const clamped = clampTo(min, max, next);
    setDraft(String(clamped));
    onCommit(clamped);
  }, [min, max, onCommit]);
  const commitDraft = () => {
    const n = Number(draft);
    if (draft.trim() !== '' && Number.isFinite(n)) commit(n);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); commitDraft(); }
  };
  const byStep = (amount: number) => commit(value + amount);
  const nudge = (dir: 1 | -1) => { const next = nudgeTarget({ ladder, steps: stepList, value, dir }); if (next !== null) commit(next); };
  return (
    <AnchoredCard anchorRef={anchorRef} title={title} role="dialog" onDismiss={onClose}>
      <Box className="number-setter__row">
        <Button variant="tertiary" size="sm" aria-label="Down" onClick={() => nudge(-1)}>-</Button>
        <TextInput
          className="number-setter__input"
          value={draft}
          inputMode="numeric"
          aria-label={`${title}, ${min} to ${max}`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commitDraft}
        />
        <Button variant="tertiary" size="sm" aria-label="Up" onClick={() => nudge(1)}>+</Button>
      </Box>
      {stepList.length > 1 && (
        <Box className="number-setter__steps">
          {[...stepList].reverse().map((step) => (
            <Button key={`-${step}`} variant="tertiary" size="sm" onClick={() => byStep(-step)}>-{format(step)}</Button>
          ))}
          {stepList.map((step) => (
            <Button key={`+${step}`} variant="tertiary" size="sm" onClick={() => byStep(step)}>+{format(step)}</Button>
          ))}
        </Box>
      )}
      {ladder && (
        <Box className="number-setter__steps number-setter__rungs">
          {ladder.map((rung) => (
            <Button key={rung} variant="tertiary" size="sm" active={rung === value} onClick={() => commit(rung)}>{format(rung)}</Button>
          ))}
        </Box>
      )}
      <Box className="number-setter__ends">
        <Pressable className="number-setter__end" onClick={() => commit(min)}>Min {format(min)}</Pressable>
        <Pressable className="number-setter__end" onClick={() => commit(max)}>Max {format(max)}</Pressable>
      </Box>
    </AnchoredCard>
  );
};

export { NumberSetter };
