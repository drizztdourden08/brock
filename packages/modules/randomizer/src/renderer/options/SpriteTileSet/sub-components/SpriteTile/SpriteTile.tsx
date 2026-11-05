/* @layer renderer-shell @kind component */
import { Badge, Box, Checkbox, Image, Text } from '@drizztdourden08/tessera/primitives';
import { ValueTag } from '@drizztdourden08/tessera/composites';
import { SPRITE_SIZE } from '../../SpriteTileSet.constants';
import type { SpriteTileItem } from '../../SpriteTileSet.type';
import type { SpriteTileProps } from './SpriteTile.type';

const artOf = ({ name, sprite }: SpriteTileItem) => (sprite === undefined
  ? <Text variant="caption" clamp={2}>{name}</Text>
  : <Image src={sprite} alt="" width={SPRITE_SIZE} height={SPRITE_SIZE} fit="contain" pixelated draggable={false} />);

const badgedArtOf = (item: SpriteTileItem) => (item.badge === undefined
  ? artOf(item)
  : <Badge value={item.badge} anchor="top-end" label={`Pick ${item.badge}`}>{artOf(item)}</Badge>);

const SpriteTile = ({ item, disabled, readout, onChange }: SpriteTileProps) => {
  const { id, name, checked, reason } = item;
  const forced = reason !== undefined;
  const title = forced ? `${name} ${reason}` : name;
  const art = badgedArtOf(item);

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
