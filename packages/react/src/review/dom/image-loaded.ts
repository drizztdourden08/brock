/* @layer renderer-shell @kind logic */
import { waitFor } from './wait-for';

const imageLoaded = async (selector: string): Promise<boolean | null> => {
  const image = document.querySelector(selector);
  if (!(image instanceof HTMLImageElement)) return null;
  await waitFor(() => image.complete);
  return image.complete && image.naturalWidth > 0;
};

export { imageLoaded };
