/* @layer renderer-shell @kind logic */
import { cancelRunOf } from './cancel-run';
import type { DndElement, DragSourceOptions } from './dnd.type';
import { startRun } from './start-run';

const disabled = (options: DragSourceOptions<unknown>): boolean => (typeof options.disabled === 'function' ? options.disabled() : options.disabled === true);

const erased = <T,>(options: DragSourceOptions<T>): DragSourceOptions<unknown> => ({
  get type() { return options.type; },
  get payload() { return options.payload; },
  get disabled() { return options.disabled; },
  onStart: (payload) => options.onStart?.(payload as T),
  onEnd: (end) => options.onEnd?.(end),
});

const dragSource = <T,>(element: DndElement, options: DragSourceOptions<T>): (() => void) => {
  const loose = erased(options);
  const onDown = (event: Event): void => {
    if ((event as PointerEvent).button !== 0 || disabled(loose)) return;
    startRun(element, loose, event);
  };
  const onNativeDrag = (event: Event): void => event.preventDefault();
  element.addEventListener('pointerdown', onDown);
  element.addEventListener('dragstart', onNativeDrag);
  return () => {
    element.removeEventListener('pointerdown', onDown);
    element.removeEventListener('dragstart', onNativeDrag);
    cancelRunOf(element);
  };
};

export { dragSource };
