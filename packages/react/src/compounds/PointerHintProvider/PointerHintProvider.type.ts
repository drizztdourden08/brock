/* @layer renderer-shell @kind types */
import type { MouseEvent, ReactNode } from 'react';
import type { ControlHint } from '../ControlLegend/ControlLegend.type';

type PointerHintState = {
  title: string;
  items: readonly ControlHint[];
  x: number;
  y: number;
};

type PointerHintApi = {
  show: (title: string, items: readonly ControlHint[], e: MouseEvent) => void;
  move: (e: MouseEvent) => void;
  hide: () => void;
};

type PointerHintProviderProps = {
  children: ReactNode;
};

export type { PointerHintApi, PointerHintProviderProps, PointerHintState };
