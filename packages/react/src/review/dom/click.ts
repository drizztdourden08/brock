/* @layer renderer-shell @kind logic */
const click = (target: HTMLElement): void => {
  const init = { bubbles: true, cancelable: true, view: window, button: 0 };
  target.dispatchEvent(new MouseEvent('mousedown', init));
  target.dispatchEvent(new MouseEvent('mouseup', init));
  target.click();
};

export { click };
