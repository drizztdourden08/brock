/* @layer renderer-shell @kind constants */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { OptionScope } from './behavior/option-scope.type';

const SCOPE_OPTIONS: { value: OptionScope; label: Text }[] = [
  { value: 'changed', label: msg('randomizer:profile.scope.changed') },
  { value: 'all', label: msg('randomizer:profile.scope.all') },
];

const SCOPE_TITLES: Readonly<Record<OptionScope, Text>> = {
  changed: msg('randomizer:profile.scope.changedTitle'),
  all: msg('randomizer:profile.scope.allTitle'),
};

const RUN_TITLE = msg('randomizer:label.run');
const ALL_DEFAULT_TEXT = msg('randomizer:profile.allDefault');
const NONE = msg('randomizer:review.none');
const ON = msg('randomizer:review.on');
const OFF = msg('randomizer:review.off');
const SET = msg('randomizer:review.set');

const FACT_LABELS = {
  server: msg('randomizer:review.server'),
  name: msg('randomizer:review.name'),
  password: msg('randomizer:review.password'),
  deathLink: msg('randomizer:profile.deathLink'),
  seed: msg('randomizer:review.seed'),
  type: msg('randomizer:profile.type'),
};

export { ALL_DEFAULT_TEXT, FACT_LABELS, NONE, OFF, ON, RUN_TITLE, SCOPE_OPTIONS, SCOPE_TITLES, SET };
