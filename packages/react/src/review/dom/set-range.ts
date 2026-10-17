/* @layer renderer-shell @kind logic */
const setRange = (input: HTMLInputElement, value: number): void => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, String(value));
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

export { setRange };
