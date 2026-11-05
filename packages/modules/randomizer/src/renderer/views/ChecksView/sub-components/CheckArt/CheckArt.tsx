/* @layer renderer-shell @kind component */
import { Center, Image, Text } from '@drizztdourden08/tessera/primitives';
import { PLACEHOLDER_ART } from '../../ChecksView.constants';
import type { CheckArtProps } from './CheckArt.type';

const CheckArt = ({ src, alt }: CheckArtProps) => {
  const placeholder = (
    <Center>
      <Text tone="faint">{PLACEHOLDER_ART}</Text>
    </Center>
  );
  return src === null ? placeholder : <Image src={src} alt={alt} draggable={false} pixelated frame fallback={placeholder} />;
};

export { CheckArt };
