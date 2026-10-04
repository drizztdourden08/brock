/* @layer renderer-shell @kind logic */
const layerHeading = (layer: HTMLElement): HTMLElement | null => {
  const id = layer.getAttribute('aria-labelledby');
  const named = id ? document.getElementById(id) : null;
  return named ?? layer.querySelector<HTMLElement>('h1, h2, h3');
};

export { layerHeading };
