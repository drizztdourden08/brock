/* @layer renderer-shell @kind types */
import type { Ref } from 'react';

interface GameCanvasProps {
  canvasRef: Ref<HTMLCanvasElement>;
  label?: string;
  smooth?: boolean;
}

export type { GameCanvasProps };
