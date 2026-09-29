/* @layer renderer-shell @kind logic */
import { waitFor } from './wait-for';

const imageAt = (selector: string): HTMLImageElement | null => {
  const found = document.querySelector(selector);
  if (found instanceof HTMLImageElement) return found;
  return found?.querySelector('img') ?? null;
};

const imageLoaded = async (selector: string): Promise<boolean | null> => {
  const image = imageAt(selector);
  if (!image) return null;
  await waitFor(() => image.complete);
  return image.complete && image.naturalWidth > 0;
};

export { imageLoaded };
