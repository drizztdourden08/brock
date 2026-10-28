/* @layer renderer-shell @kind logic */
import { cancelRunOf } from './cancel-run';
import type { DndElement, DragSourceOptions } from './dnd.type';
import { startRun } from './start-run';

const disabled = (options: DragSourceOptions<unknown>): boolean => (typeof options.disabled === 'function' ? options.disabled() : options.disabled === true);

const erased = <T,>(options: DragSourceOptions<T>): DragSourceOptions<unknown> => ({
  type: options.type,
  payload: options.payload,
  disabled: options.disabled,
  onStart: options.onStart ? (payload) => options.onStart?.(payload as T) : undefined,
  onEnd: options.onEnd,
});

const dragSource = <T,>(element: DndElement, options: DragSourceOptions<T>): (() => void) => {
  const loose = erased(options);
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
