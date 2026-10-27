/* @layer renderer-shell @kind logic */
import { NO_CONTROL_SOURCES } from './control-sources.constants';
import type { ControlSources } from './control-sources.type';

const held: { current: ControlSources } = { current: NO_CONTROL_SOURCES };

const controlSources = {
  publish: (sources: ControlSources): (() => void) => {
    held.current = sources;
    return () => {
      if (held.current === sources) held.current = NO_CONTROL_SOURCES;
    };
  },
  get: (): ControlSources => held.current,
};

export { controlSources };
