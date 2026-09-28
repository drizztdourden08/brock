/* @layer renderer-shell @kind component */
import { Canvas } from '@drizztdourden08/tessera/primitives';
import type { GameCanvasProps } from './GameCanvas.type';
import './GameCanvas.css';

const GameCanvas = ({ canvasRef, label = 'Game screen', smooth = false }: GameCanvasProps) => (
  <Canvas
    ref={canvasRef}
    className={smooth ? 'game-canvas' : 'game-canvas game-canvas--pixelated'}
    tabIndex={0}
    aria-label={label}
    onContextMenu={(event) => event.preventDefault()}
  />
);

export { GameCanvas };
