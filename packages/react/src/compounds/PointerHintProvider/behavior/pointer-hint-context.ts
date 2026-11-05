/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { PointerHintApi } from '../PointerHintProvider.type';

const noop = (): void => undefined;

const PointerHintContext = createContext<PointerHintApi>({ show: noop, move: noop, hide: noop });

export { PointerHintContext };
