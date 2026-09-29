/* @layer renderer-shell @kind logic */
const typeText = (input: HTMLInputElement, text: string): void => {
  input.focus();
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, text);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

export { typeText };
