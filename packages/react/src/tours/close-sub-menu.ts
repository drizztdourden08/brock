/* @layer renderer-shell @kind logic */
const closeSubMenu = (panel: HTMLElement): void => {
  panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
};

export { closeSubMenu };
