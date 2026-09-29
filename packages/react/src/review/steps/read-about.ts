/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { imageLoaded } from '../dom/image-loaded';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { AboutSnapshot } from '../review.type';

const rowValue = (label: string): string | null => {
  const rows = [...document.querySelectorAll<HTMLElement>(SELECTORS.aboutRow)];
  const row = rows.find((candidate) => candidate.querySelector(SELECTORS.aboutLabel)?.textContent.trim() === label);
  const value = row?.querySelector(SELECTORS.aboutValue)?.textContent.trim();
  return value === undefined || value === '' ? null : value;
};

const readAbout = async (label: string): Promise<AboutSnapshot> => {
  const appVersion = await requireHostApi().getAppVersion();
  await waitFor(() => rowValue(label) === appVersion);
  return { logoLoaded: await imageLoaded(SELECTORS.aboutLogo), version: rowValue(label), appVersion };
};

export { readAbout };
