/* @layer renderer-shell @kind logic */
import { paletteSearch } from '../search/palette-search';
import type { StepTour } from '../review.type';
import { resetUi } from './reset-ui';

const hiddenSearchChecks = async (tour: StepTour): Promise<void> => {
  for (const record of tour.env.menuOverrides.filter((entry) => entry.override.hidden === true)) {
    await resetUi();
    const { shown, row } = await paletteSearch(record.label);
    tour.check(
      `search-hidden-${record.key}`,
      row === null,
      `"${record.label}" (${record.key}) is hidden from the search palette too`,
      `"${record.label}" (${record.key}) is hidden by the config but the palette lists it: ${shown.join(', ')}`,
    );
  }
};

export { hiddenSearchChecks };
