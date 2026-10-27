/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { InputItem } from '../../hid-calibration/hid-calibration.type';
import { buildRecord } from './build-record';
import { describeRecord } from './describe-record';
import type { PositionalCaptureRecord, UsePositionalOneByOneProps } from './positional-capture.type';
import { startAxisRanges } from './start-axis-ranges';
import { toInputItem } from './to-input-item';
import { usePositionalRefs } from './usePositionalRefs';
import { useStableTargets } from './useStableTargets';

const usePositionalSession = (props: Pick<UsePositionalOneByOneProps, 'active' | 'resolvedDevice'>) => {
  const { active, resolvedDevice } = props;
  const refs = usePositionalRefs();
  const stableTargets = useStableTargets(resolvedDevice);
  const [items, setItems] = useState<InputItem[]>([]);
  const [records, setRecords] = useState<PositionalCaptureRecord[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputPhaseActive, setInputPhaseActive] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const setInputPhaseActiveWrapped = useCallback((v: boolean) => { refs.inputPhaseActiveRef.current = v; setInputPhaseActive(v); }, [refs]);
  const setAutoAdvanceWrapped = useCallback((v: boolean) => { refs.autoAdvanceRef.current = v; setAutoAdvance(v); }, [refs]);

  useEffect(() => {
    if (!active) return;
    refs.targetsRef.current = stableTargets;
    refs.trimmedRef.current = false;
    setItems(stableTargets.map(toInputItem));
    setRecords([]);
    refs.activeIndexRef.current = -1; setActiveIndex(-1);
    setInputPhaseActiveWrapped(false);
  }, [active, stableTargets, refs, setInputPhaseActiveWrapped]);

  const activateIndex = useCallback((idx: number) => {
    refs.activeIndexRef.current = idx; setActiveIndex(idx);
    refs.baselineRef.current = refs.latestSampleRef.current;
    refs.rangesRef.current = refs.latestSampleRef.current ? startAxisRanges(refs.latestSampleRef.current) : [];
    refs.awaitingRestRef.current = true;
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, status: 'active' } : it)));
  }, [refs]);

  const advance = useCallback(() => {
    const next = refs.activeIndexRef.current + 1;
    if (next >= refs.targetsRef.current.length) { setInputPhaseActiveWrapped(false); return; }
    activateIndex(next);
  }, [refs, activateIndex, setInputPhaseActiveWrapped]);

  const answerActive = useCallback((status: PositionalCaptureRecord['status'], firedIndex: number | null) => {
    const idx = refs.activeIndexRef.current;
    const target = refs.targetsRef.current[idx];
    if (!target) return;
    const record = buildRecord(target, status, firedIndex);
    setRecords((prev) => { const next = [...prev]; next[idx] = record; return next; });
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, status, result: describeRecord(record) } : it)));
    if (refs.autoAdvanceRef.current) advance();
  }, [refs, advance]);

  return {
    refs, items, setItems, records, setRecords, activeIndex, setActiveIndex, inputPhaseActive, autoAdvance,
    setInputPhaseActiveWrapped, setAutoAdvanceWrapped, activateIndex, answerActive,
  };
};

export { usePositionalSession };
