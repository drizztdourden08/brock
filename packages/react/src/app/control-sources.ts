/* @layer renderer-shell @kind logic */
import { fallbackText } from '../i18n/fallback-text';
import { NO_CONTROL_SOURCES } from './control-sources.constants';
import type { ControlSources, ControlSourcesInput } from './control-sources.type';

const held: { current: ControlSources } = { current: NO_CONTROL_SOURCES };

const controlSources = {
  publish: (sources: ControlSourcesInput): (() => void) => {
    const next: ControlSources = { ...sources, text: sources.text ?? fallbackText };
    held.current = next;
    return () => {
      if (held.current === next) held.current = NO_CONTROL_SOURCES;
    };
  },
  get: (): ControlSources => held.current,
};

export { controlSources };
