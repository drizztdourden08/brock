/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { WidgetDisabledState } from '@drizztdourden08/tessera/composites';
import { resolveWidgetGate } from './resolve-widget-gate';
import type { WidgetGatesConfig, WidgetGatesHook } from './widget-gates.type';

const defineWidgetGates = <S>(config: WidgetGatesConfig<S>): WidgetGatesHook => {
  const useWidgetGates = (): ((id: string) => WidgetDisabledState | null) => {
    const settings = config.useSettings();
    return useCallback((id: string) => {
      const gate = config.gates[id];
      return gate ? resolveWidgetGate(gate, settings, config) : null;
    }, [settings]);
  };
  return useWidgetGates;
};

export { defineWidgetGates };
