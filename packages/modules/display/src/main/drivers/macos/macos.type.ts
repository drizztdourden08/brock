/* @layer electron-main @kind types */
import type { NativeFunction } from '../koffi/koffi.type';
import type { CF_SIGNATURES, CG_SIGNATURES } from './macos.constants';

type MacBindings = Record<keyof typeof CG_SIGNATURES | keyof typeof CF_SIGNATURES, NativeFunction>;

interface ModeSet {
  api: MacBindings;
  modes: unknown[];
  current: unknown;
}

export type { MacBindings, ModeSet };
