/* @layer renderer-shell @kind logic */
import type { HeroArt } from '@drizztdourden08/tessera/composites';
import type { HeroArtProps } from './screen-kinds.type';

const heroArtOf = (props: HeroArtProps): HeroArt => (props.kind === 'node'
  ? { kind: 'node', node: props.node, label: props.label }
  : { kind: 'image', src: props.src, alt: props.alt, pixelated: props.pixelated });

export { heroArtOf };
