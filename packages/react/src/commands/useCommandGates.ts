/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { GateState } from './command-gates.type';

const useCommandGates = create<GateState>()(() => ({ gates: {} }));

export { useCommandGates };
