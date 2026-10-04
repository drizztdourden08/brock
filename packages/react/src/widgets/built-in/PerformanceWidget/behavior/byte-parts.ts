/* @layer renderer-shell @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core';
import type { ByteParts } from '../PerformanceWidget.type';

const byteParts = (bytes: number): ByteParts => {
  const text = formatBytes(bytes);
  const split = text.lastIndexOf(' ');
  return { value: text.slice(0, split), unit: text.slice(split + 1) };
};

export { byteParts };
