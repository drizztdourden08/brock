/* @layer renderer-shell @kind logic */
import type { HeroBackdrop } from '@drizztdourden08/tessera/composites';
import type { HeroBackdropProps } from './screen-kinds.type';

const heroBackdropOf = (props: HeroBackdropProps): HeroBackdrop | null => {
  switch (props.kind) {
    case 'none': return null;
    case 'node': return { kind: 'node', node: props.node };
    case 'color': return { kind: 'color', color: props.color };
    case 'image': return {
      kind: 'image', src: props.src, fit: props.fit, position: props.position, tileSize: props.tileSize, color: props.color, pixelated: props.pixelated,
    };
  }
};

export { heroBackdropOf };
