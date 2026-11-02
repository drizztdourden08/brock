/* @layer renderer-shell @kind logic */
import './show-ghost.css';
import type { DragPoint, DragPreviewOptions } from './dnd.type';
import type { DragGhost } from './drag-run.type';

const resolve = <V,>(value: V | ((payload: unknown) => V), payload: unknown): V => (typeof value === 'function' ? (value as (payload: unknown) => V)(payload) : value);

const part = (name: string, text: string): HTMLElement => {
  const node = document.createElement('span');
  node.className = `brock-drag-ghost__${name}`;
  node.textContent = text;
  return node;
};

const place = (node: HTMLElement, point: DragPoint): void => {
  node.style.setProperty('--drag-x', `${point.x}px`);
  node.style.setProperty('--drag-y', `${point.y}px`);
};

const showGhost = (preview: DragPreviewOptions<unknown>, payload: unknown, point: DragPoint): DragGhost => {
  const node = document.createElement('div');
  node.className = 'brock-drag-ghost';
  node.setAttribute('aria-hidden', 'true');
  if (preview.count !== undefined) node.append(part('count', String(resolve(preview.count, payload))));
  node.append(part('label', resolve(preview.label, payload)));
  place(node, point);
  document.body.append(node);
  return { move: (next) => place(node, next), remove: () => node.remove() };
};

export { showGhost };
