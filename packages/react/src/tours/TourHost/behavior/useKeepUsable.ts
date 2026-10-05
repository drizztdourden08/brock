/* @layer renderer-shell @kind hook */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { NO_KEPT } from '../TourHost.constants';
import { keptUsable } from './keep-usable';

const touchedBy = (records: readonly MutationRecord[]): ReadonlySet<Node> => new Set(records.map((record) => record.target));

const useKeepUsable = (open: boolean, keep: () => readonly Element[], stepKey: string): void => {
  const latest = useRef(keep);
  latest.current = keep;
  const applyRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    if (!open) return undefined;
    let kept = NO_KEPT;
    const apply = (records: readonly MutationRecord[]): void => {
      keptUsable.undo(kept, touchedBy(records));
      kept = keptUsable.keep(latest.current(), document.body);
      observer.takeRecords();
    };
    const observer = new MutationObserver((records) => apply([...records, ...observer.takeRecords()]));
    applyRef.current = () => apply(observer.takeRecords());
    observer.observe(document.body, { attributes: true, attributeFilter: ['inert'], subtree: true });
    apply([]);
    return () => {
      observer.disconnect();
      applyRef.current = null;
      keptUsable.undo(kept, null);
    };
  }, [open]);

  useEffect(() => {
    applyRef.current?.();
    const frame = requestAnimationFrame(() => applyRef.current?.());
    return () => cancelAnimationFrame(frame);
  }, [stepKey]);
};

export { useKeepUsable };
