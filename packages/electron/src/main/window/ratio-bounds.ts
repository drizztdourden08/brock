/* @layer electron-main @kind logic */
import type { Rectangle } from 'electron';
import type { AspectLock } from './aspect-lock.type';

const fitSize = (bounds: Rectangle, edge: string, lock: AspectLock): Pick<Rectangle, 'width' | 'height'> | null => {
  const { ratio, extraHeight } = lock;
  if (edge === 'left' || edge === 'right') return { width: bounds.width, height: Math.round(bounds.width / ratio) + extraHeight };
  if (edge === 'bottom' || edge === 'top') return { width: Math.round((bounds.height - extraHeight) * ratio), height: bounds.height };
  const wForH = Math.round((bounds.height - extraHeight) * ratio);
  const hForW = Math.round(bounds.width / ratio) + extraHeight;
  const fitsW = wForH <= bounds.width;
  const fitsH = hForW <= bounds.height;
  if (fitsW && fitsH) return wForH * bounds.height >= bounds.width * hForW ? { width: wForH, height: bounds.height } : { width: bounds.width, height: hForW };
  if (fitsW) return { width: wForH, height: bounds.height };
  if (fitsH) return { width: bounds.width, height: hForW };
  return null;
};

const ratioBounds = (current: Rectangle, proposed: Rectangle, edge: string, lock: AspectLock): Rectangle | null => {
  if (lock.ratio <= 0) return proposed;
  const target = fitSize(proposed, edge, lock);
  if (!target) return null;
  if (target.width === proposed.width && target.height === proposed.height) return proposed;
  const x = edge.includes('left') ? current.x + current.width - target.width : proposed.x;
  const y = edge.includes('top') ? current.y + current.height - target.height : proposed.y;
  return { x, y, width: target.width, height: target.height };
};

export { ratioBounds };
