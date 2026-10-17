/* @layer renderer-shell @kind logic */
import type { HeroArt } from '@drizztdourden08/tessera/composites';
import type { HeroArtProps } from './screen-kinds.type';

const heroArtOf = (props: HeroArtProps): HeroArt | null => {
  switch (props.kind) {
    case 'none': return null;
    case 'node': return { kind: 'node', node: props.node, label: props.label };
    case 'image': return { kind: 'image', src: props.src, alt: props.alt, pixelated: props.pixelated };
  }
};

export { heroArtOf };
