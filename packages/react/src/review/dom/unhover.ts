/* @layer renderer-shell @kind logic */
const unhover = (target: HTMLElement): void => {
  target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window, relatedTarget: null }));
};

export { unhover };
