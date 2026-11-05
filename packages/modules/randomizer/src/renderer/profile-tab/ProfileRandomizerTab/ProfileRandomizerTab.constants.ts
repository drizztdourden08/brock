/* @layer renderer-shell @kind constants */
import type { SegmentOption } from '@drizztdourden08/tessera/primitives';
import type { OptionScope } from './behavior/option-scope.type';

const SCOPE_OPTIONS: SegmentOption<OptionScope>[] = [
  { value: 'changed', label: 'Changed' },
  { value: 'all', label: 'All' },
];

const SCOPE_TITLES: Readonly<Record<OptionScope, string>> = {
  changed: 'Options changed from the default',
  all: 'Every option',
};

const RUN_TITLE = 'Run';

const ALL_DEFAULT_TEXT = 'Every option is at its default.';

const NONE = 'None';

const ON = 'On';

const OFF = 'Off';

export { ALL_DEFAULT_TEXT, NONE, OFF, ON, RUN_TITLE, SCOPE_OPTIONS, SCOPE_TITLES };
