/* @layer renderer-shell @kind logic */
import { menuOverrideChecks } from '../checks/menu-override-checks';
import { closeMenu } from '../menu/close-menu';
import { menuPathTo } from '../menu/menu-path-to';
import { readMenuPanel } from '../menu/read-menu-panel';
import { MENU_OVERRIDE_CAPTURES, PATH_JOIN } from '../review.constants';
import type { StepTour } from '../review.type';

const drawnRecords = (tour: StepTour): StepTour['env']['menuOverrides'] =>
  tour.env.menuOverrides.filter((record) => !tour.env.actions.some((action) => action.id === record.key));

const parentPaths = (tour: StepTour): string[][] => {
  const { menu } = tour.env;
  const paths = new Map<string, string[]>([['', []]]);
  for (const record of drawnRecords(tour)) {
    const parents = menuPathTo(menu, (item) => item.key === record.key)?.slice(0, -1) ?? [];
    paths.set(parents.join(PATH_JOIN), parents);
  }
  return [...paths.values()];
};

const captureName = (parents: readonly string[]): string => `menu-in-${parents.join('-').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const menuOverridePass = async (tour: StepTour, ignored: readonly string[]): Promise<void> => {
  const records = drawnRecords(tour);
  if (records.length === 0) return;
  const panels = new Map<string, string[] | null>();
  let captures = 0;
  for (const parents of parentPaths(tour)) {
    panels.set(parents.join(PATH_JOIN), await readMenuPanel(parents));
    if (parents.length > 0 && captures < MENU_OVERRIDE_CAPTURES) {
      captures += 1;
      await tour.capture(captureName(parents));
    }
  }
  await closeMenu();
  tour.report(menuOverrideChecks(records, tour.env.menu, (parents) => panels.get(parents.join(PATH_JOIN)) ?? null, ignored));
};

export { menuOverridePass };
