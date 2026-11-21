/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';

const NO_VALUE = msg('randomizer:run.tile.none');
const DEFAULT_SLOT = msg('randomizer:run.tile.defaultSlot');
const ON_LABEL = msg('randomizer:run.tile.on');
const OFF_LABEL = msg('randomizer:run.tile.off');
const TILE_LABELS = {
  profile: msg('randomizer:run.tile.profile'),
  seed: msg('randomizer:run.tile.seed'),
  mode: msg('randomizer:run.tile.mode'),
  origin: msg('randomizer:run.tile.origin'),
  server: msg('randomizer:run.tile.server'),
  slot: msg('randomizer:run.tile.slot'),
  deathLink: msg('randomizer:run.tile.deathLink'),
};

export { DEFAULT_SLOT, NO_VALUE, OFF_LABEL, ON_LABEL, TILE_LABELS };
