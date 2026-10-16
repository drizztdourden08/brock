/* @layer renderer-shell @kind logic */
import type { CSSProperties } from 'react';
import type { PaintedBackdrop } from '../HubBackdrop.type';

const colorOf = (color: string | undefined): string | undefined =>
  (color?.startsWith('--') === true ? `var(${color})` : color);

const backdropStyle = (backdrop: PaintedBackdrop): CSSProperties => {
  if (backdrop.kind === 'color') return { backgroundColor: colorOf(backdrop.color) };
  return {
    backgroundImage: `url(${JSON.stringify(backdrop.src)})`,
    backgroundPosition: backdrop.position,
    backgroundSize: backdrop.fit === 'tile' ? backdrop.tileSize : undefined,
    backgroundColor: colorOf(backdrop.color),
  };
};

export { backdropStyle };
