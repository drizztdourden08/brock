/* @layer renderer-shell @kind logic */
import { widgets } from '../../widgets/widgets';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { SEARCH_TOP } from '../review.constants';
import type { SearchSample, StepTour, ReviewStep } from '../review.type';
import { hubSearchPick } from '../search/hub-search-pick';
import { palettePick } from '../search/palette-pick';
import { reachedTarget } from '../search/reached-target';
import { searchSamples } from '../search/search-samples';
import { resetUi } from './reset-ui';

const checkId = (sample: SearchSample): string => `search-${sample.source.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

const whereTo = (sample: SearchSample): string =>
  sample.widget === undefined ? `${sample.target?.route ?? ''}${sample.target?.anchor ? ` at "${sample.target.anchor}"` : ''}` : `the ${sample.widget} widget`;

const checkSample = async (tour: StepTour, sample: SearchSample, capture: boolean): Promise<void> => {
  const { label, source } = sample;
  const pick = await palettePick(label, capture ? () => tour.capture('search-palette') : undefined);
  const shown = pick.shown.join(', ') || 'no results';
  tour.check(`${checkId(sample)}-listed`, pick.picked, `"${label}" (${source}) is in the top ${SEARCH_TOP} results`, `"${label}" (${source}) is not in the top ${SEARCH_TOP}: ${shown}`);
  if (!pick.picked) return;
  const reached = await reachedTarget(sample);
  tour.check(`${checkId(sample)}-opens`, reached, `choosing "${label}" opened ${whereTo(sample)}`, `choosing "${label}" did not open ${whereTo(sample)}`);
  if (sample.widget !== undefined) widgets.close(sample.widget);
};

const searchStep: ReviewStep = {
  name: 'search',
  run: async (tour) => {
    const samples = searchSamples(tour.env, useWidgetLayoutStore.getState().definitions);
    tour.check('search-samples', samples.length > 0, `${samples.length} sample(s): ${samples.map((s) => s.source).join(', ')}`, 'the index gave no sample to search for');
    const firstSetting = samples.find((sample) => sample.source.startsWith('setting'));
    for (const sample of samples) {
      await resetUi();
      await checkSample(tour, sample, sample === firstSetting);
    }
    if (firstSetting === undefined) return;
    await resetUi();
    await hubSearchPick(tour, firstSetting);
  },
};

export { searchStep };
