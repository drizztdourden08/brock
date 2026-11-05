/* @layer renderer-shell @kind component */
import { Box, Checkbox, Image } from '@drizztdourden08/tessera/primitives';
import { ValueTag } from '@drizztdourden08/tessera/composites';
import { SPRITE_SIZE } from '../../SpriteTileSet.constants';
import type { SpriteTileProps } from './SpriteTile.type';

const SpriteTile = ({ item, disabled, readout, onChange }: SpriteTileProps) => {
  const { id, name, sprite, checked, reason } = item;
  const forced = reason !== undefined;
  const title = forced ? `${name} ${reason}` : name;
  const art = <Image src={sprite} alt="" width={SPRITE_SIZE} height={SPRITE_SIZE} fit="contain" pixelated draggable={false} />;

  return (
    <Box surface={checked ? 'raised' : 'sunken'} title={title}>
      {readout ? <ValueTag label={art} value={checked} compact /> : (
        <Checkbox
          checked={checked}
          ariaLabel={title}
          disabled={disabled || forced}
          onChange={(next) => onChange?.(id, next)}
          label={art}
        />
      )}
    </Box>
  );
};

export { SpriteTile };
