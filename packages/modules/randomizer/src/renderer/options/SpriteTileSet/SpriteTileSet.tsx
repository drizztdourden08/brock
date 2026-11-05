/* @layer renderer-shell @kind component */
import { Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { orderedTiles } from './behavior/ordered-tiles';
import { SpriteTile } from './sub-components/SpriteTile';
import type { SpriteTileSetProps } from './SpriteTileSet.type';

const SpriteTileSet = (props: SpriteTileSetProps) => {
  const { items, order, label, disabled = false, readout = false, onChange } = props;
  const tiles = orderedTiles(items, order);
  const inert = disabled || onChange === undefined;

  return (
    <Stack gap="xs">
      {label !== undefined && <Text variant="overline" tone="muted">{label}</Text>}
      <Flex wrap gap="xs">
        {tiles.map((item) => (
          <SpriteTile key={item.id} item={item} disabled={inert} readout={readout} onChange={onChange} />
        ))}
      </Flex>
      {tiles.filter((item) => item.reason !== undefined).map((item) => (
        <Text key={item.id} variant="caption" tone="danger">{`${item.name} ${item.reason}`}</Text>
      ))}
    </Stack>
  );
};

export { SpriteTileSet };
