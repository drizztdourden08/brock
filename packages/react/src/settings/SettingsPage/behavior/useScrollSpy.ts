/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import { COMPACT_AFTER, CURRENT_SLACK } from '../SettingsPage.constants';

const sectionEl = (body: HTMLElement, id: string): HTMLElement | null =>
  body.querySelector<HTMLElement>(`[data-section="${id}"]`);

const useScrollSpy = (ids: readonly string[]) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  const [compact, setCompact] = useState(false);

  const update = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;
    setCompact(body.scrollTop > COMPACT_AFTER);
    const top = body.getBoundingClientRect().top + CURRENT_SLACK;
    let current = ids[0] ?? '';
    for (const id of ids) {
      const el = sectionEl(body, id);
      if (el && el.getBoundingClientRect().top <= top) current = id;
    }
    setActiveId(current);
  }, [ids]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    update();
    body.addEventListener('scroll', update, { passive: true });
    return () => body.removeEventListener('scroll', update);
  }, [update]);

  const jumpTo = useCallback((id: string) => {
    const body = bodyRef.current;
    if (!body) return;
    sectionEl(body, id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  }, []);

  return { bodyRef, activeId, compact, jumpTo };
};

export { useScrollSpy };
