/* @layer renderer-shell @kind logic */
import { palette } from '../../palette/palette';
import { find } from '../dom/find';
import { press } from '../dom/press-key';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';

const paletteScopeCheck = async (tour: StepTour, bucket: string, title: string): Promise<void> => {
  press({ key: 'k', ctrlKey: true });
  const heading = await waitFor(() => find(SELECTORS.paletteHeading));
  const scoped = heading !== null && heading.textContent.trim() === title;
  tour.check('search-hub-shortcut', scoped, `Ctrl+K inside the "${bucket}" hub opened the palette with ${title} first`, `Ctrl+K inside the "${bucket}" hub did not open the palette scoped to ${title}`);
  if (heading !== null) await tour.capture('search-hub-palette');
  palette.close();
  await waitFor(() => !palette.isOpen());
};

export { paletteScopeCheck };
