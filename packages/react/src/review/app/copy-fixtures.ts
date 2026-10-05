/* @layer renderer-shell @kind logic */
import type { AppReviewFixture, AppReviewTour } from '../app-review.type';

const bytesOf = async (fixture: AppReviewFixture): Promise<Uint8Array> => {
  const url = (await fixture.load()).default;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${fixture.path}: ${response.status} ${response.statusText}`);
  return new Uint8Array(await response.arrayBuffer());
};

const copyFixtures = async (tour: AppReviewTour, fixtures: readonly AppReviewFixture[]): Promise<void> => {
  const failed: string[] = [];
  for (const fixture of fixtures) {
    try {
      await tour.platform.files.writeBytes(fixture.path, await bytesOf(fixture));
    } catch (err) {
      failed.push(err instanceof Error ? err.message : `${fixture.path}: ${String(err)}`);
    }
  }
  const copied = fixtures.length - failed.length;
  tour.check('fixtures-copied', failed.length === 0, `${copied} file(s) from src/review/fixtures copied into the app data folder`, `src/review/fixtures did not all copy: ${failed.join('; ')}`);
};

export { copyFixtures };
