/* @layer renderer-shell @kind logic */
import type { DragSourceOptions } from './dnd.type';
import { cancelRunOf, startRun } from './drag-run';

const disabled = (options: DragSourceOptions<unknown>): boolean => (typeof options.disabled === 'function' ? options.disabled() : options.disabled === true);

const dragSource = <T,>(element: Element, options: DragSourceOptions<T>): (() => void) => {
  const loose = options as DragSourceOptions<unknown>;
  const onDown = (event: Event): void => {
    if ((event as PointerEvent).button !== 0 || disabled(loose)) return;
    startRun(element, loose, event);
  };
  element.addEventListener('pointerdown', onDown);
  return () => {
    element.removeEventListener('pointerdown', onDown);
    cancelRunOf(element);
  };
};

export { dragSource };
