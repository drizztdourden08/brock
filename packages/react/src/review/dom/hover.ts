/* @layer renderer-shell @kind logic */
const hover = (target: HTMLElement): void => {
  target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window, relatedTarget: null }));
};

export { hover };
