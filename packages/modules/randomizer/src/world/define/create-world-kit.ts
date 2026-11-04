/* @layer core @kind logic */
import { mainFillPhase } from '../fill/main-fill-phase';
import {
  FALSE, TRUE, all, any, countGroup, has, hasAny, hasDistinct, helper, option, optionRef, optionSwitch, region,
  seedIs, when,
} from '../rules/build';
import {
  allOf, anyOf, canCollect, canReach, either, exitRule, hasAnyItem, hasItem, helperRule, placedAt, placedIn,
} from '../rules/combinators';
import { compileRule } from '../rules/compile';
import { NO_HELPERS } from '../rules/no-helpers.constants';
import type { WorldKeys } from '../types';
import type { WorldKit } from './world-kit.type';

const createWorldKit = <K extends WorldKeys>(): WorldKit<K> => ({
  all: all<K>,
  any: any<K>,
  when: when<K>,
  has: has<K>,
  hasAny: hasAny<K>,
  hasDistinct: hasDistinct<K>,
  countGroup: countGroup<K>,
  helper: helper<K>,
  option: option<K>,
  optionRef: optionRef<K>,
  optionSwitch: optionSwitch<K>,
  region: region<K>,
  seedIs: seedIs<K>,
  allOf: allOf<K>,
  anyOf: anyOf<K>,
  either: either<K>,
  hasItem: hasItem<K>,
  hasAnyItem: hasAnyItem<K>,
  canCollect: canCollect<K>,
  canReach: canReach<K>,
  exitRule: exitRule<K>,
  helperRule: helperRule<K>,
  placedAt: placedAt<K>,
  placedIn: placedIn<K>,
  always: compileRule<K>(TRUE, NO_HELPERS),
  never: compileRule<K>(FALSE, NO_HELPERS),
  mainFill: mainFillPhase<K>(),
});

export { createWorldKit };
