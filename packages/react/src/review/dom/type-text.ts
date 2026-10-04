/* @layer renderer-shell @kind logic */
const typeText = (input: HTMLInputElement | HTMLTextAreaElement, text: string): void => {
  input.focus();
  const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(input, text);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

export { typeText };
