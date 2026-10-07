/* @layer renderer-shell @kind logic */
import { insideWidgets } from './inside-widgets';
import { CONTROL, KEEPS_FOCUS, MODIFIER_KEYS, TYPING } from './useWidgetsNeverFocus.constants';

const blurElement = (element: Element): void => {
  if (element instanceof HTMLElement || element instanceof SVGElement) element.blur();
};

const guardWidgetFocus = (doc: Document): (() => void) => {
  const press = { pointer: false, inWidgets: false };
  const fromWidgetPress = (): boolean => press.pointer && press.inWidgets;
  const dropFocus = (): void => {
    const active = doc.activeElement;
    if (fromWidgetPress() && insideWidgets(active) && active.closest(TYPING) === null) blurElement(active);
  };
  const onPointerDown = (event: PointerEvent): void => {
    press.pointer = true;
    press.inWidgets = insideWidgets(event.target);
  };
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!MODIFIER_KEYS.has(event.key)) press.pointer = false;
  };
  const onMouseDown = (event: MouseEvent): void => {
    const { target } = event;
    if (insideWidgets(target) && target.closest(KEEPS_FOCUS) === null && target.closest(CONTROL) !== null) event.preventDefault();
  };
  const onFocusIn = (event: FocusEvent): void => {
    const { target } = event;
    if (fromWidgetPress() && insideWidgets(target) && target.closest(KEEPS_FOCUS) === null) blurElement(target);
  };
  const listeners = [
    ['pointerdown', onPointerDown, true], ['keydown', onKeyDown, true], ['mousedown', onMouseDown, true], ['focusin', onFocusIn, true],
    ['pointerup', dropFocus, true], ['change', dropFocus, true], ['click', dropFocus, false],
  ] as const;
  for (const [name, listener, capture] of listeners) doc.addEventListener(name, listener as EventListener, capture);
  return () => {
    for (const [name, listener, capture] of listeners) doc.removeEventListener(name, listener as EventListener, capture);
  };
};

export { guardWidgetFocus };
