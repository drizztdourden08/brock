/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';

const ALL_DEFAULT_ROW = { label: msg('randomizer:review.options'), value: msg('randomizer:review.allDefault') };

const NONE_TEXT = msg('randomizer:review.none');

const REVIEW_TITLES = {
  randomizer: msg('randomizer:review.randomizer'),
  connection: msg('randomizer:review.connection'),
  options: msg('randomizer:review.options'),
};

const REVIEW_LABELS = {
  on: msg('randomizer:review.on'),
  off: msg('randomizer:review.off'),
  set: msg('randomizer:review.set'),
  seed: msg('randomizer:review.seed'),
  mode: msg('randomizer:review.mode'),
  server: msg('randomizer:review.server'),
  name: msg('randomizer:review.name'),
  password: msg('randomizer:review.password'),
};

export { ALL_DEFAULT_ROW, NONE_TEXT, REVIEW_LABELS, REVIEW_TITLES };
