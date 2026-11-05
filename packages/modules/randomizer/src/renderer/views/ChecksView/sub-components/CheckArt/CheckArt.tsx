/* @layer renderer-shell @kind component */
import { Center, Image, Text } from '@drizztdourden08/tessera/primitives';
import { PLACEHOLDER_ART } from '../../ChecksView.constants';
import type { CheckArtProps } from './CheckArt.type';

const Placeholder = () => (
  <Center>
    <Text tone="faint">{PLACEHOLDER_ART}</Text>
  </Center>
);

const CheckArt = ({ src, alt }: CheckArtProps) =>
  src === null ? <Placeholder /> : <Image src={src} alt={alt} draggable={false} pixelated frame fallback={<Placeholder />} />;

export { CheckArt };
