/* @layer renderer-shell @kind component */
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Box, Portal, Text } from '@drizztdourden08/tessera/primitives';
import { ControlLegend } from '../ControlLegend';
import type { ControlHint } from '../ControlLegend';
import { PointerHintContext } from './behavior/pointer-hint-context';
import { POINTER_OFFSET, VIEWPORT_EDGE } from './PointerHintProvider.constants';
import type { PointerHintApi, PointerHintProviderProps, PointerHintState } from './PointerHintProvider.type';
import './PointerHintProvider.css';

const PointerHintProvider = ({ children }: PointerHintProviderProps) => {
  const [state, setState] = useState<PointerHintState | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const place = useCallback((e: MouseEvent): { x: number; y: number } => {
    const w = boxRef.current?.offsetWidth ?? 0;
    const h = boxRef.current?.offsetHeight ?? 0;
    let x = e.clientX + POINTER_OFFSET;
    let y = e.clientY + POINTER_OFFSET;
    if (x + w > window.innerWidth - VIEWPORT_EDGE) x = Math.max(VIEWPORT_EDGE, e.clientX - w - POINTER_OFFSET);
    if (y + h > window.innerHeight - VIEWPORT_EDGE) y = Math.max(VIEWPORT_EDGE, e.clientY - h - POINTER_OFFSET);
    return { x, y };
  }, []);

  const api = useMemo<PointerHintApi>(() => ({
    show: (title: string, items: readonly ControlHint[], e: MouseEvent) => setState({ title, items, ...place(e) }),
    move: (e: MouseEvent) => setState((prev) => (prev ? { ...prev, ...place(e) } : prev)),
    hide: () => setState(null),
  }), [place]);

  useLayoutEffect(() => {
    if (!state || !boxRef.current) return;
    boxRef.current.style.setProperty('--pointer-hint-x', `${state.x}px`);
    boxRef.current.style.setProperty('--pointer-hint-y', `${state.y}px`);
  }, [state]);

  return (
    <PointerHintContext.Provider value={api}>
      {children}
      {state && (
        <Portal layer="tooltip">
          <Box ref={boxRef} className="pointer-hint" aria-hidden="true">
            <Text className="pointer-hint__title">{state.title}</Text>
            <ControlLegend className="pointer-hint__rows" items={state.items} label={state.title} />
          </Box>
        </Portal>
      )}
    </PointerHintContext.Provider>
  );
};

export { PointerHintProvider };
