/* @layer core @kind logic */
import { MAX_CHANNEL } from './baseline.constants';
import type { BaselineConfig, BaselineMask, BaselineRule } from './baseline.type';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const isSize = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;

const toleranceOf = (value: unknown, where: string): number | undefined => {
  if (value === undefined) return undefined;
  if (isSize(value) && value <= 1) return value;
  throw new Error(`${where}.tolerance must be a share of the pixels from 0 to 1`);
};

const thresholdOf = (value: unknown, where: string): number | undefined => {
  if (value === undefined) return undefined;
  if (isSize(value) && Number.isInteger(value) && value <= MAX_CHANNEL) return value;
  throw new Error(`${where}.threshold must be a whole channel difference from 0 to ${MAX_CHANNEL}`);
};

const maskOf = (value: unknown, where: string): BaselineMask => {
  if (isRecord(value) && typeof value.selector === 'string' && value.selector.trim() !== '') return { selector: value.selector };
  if (isRecord(value) && isSize(value.x) && isSize(value.y) && isSize(value.width) && isSize(value.height)) {
    return { x: value.x, y: value.y, width: value.width, height: value.height };
  }
  throw new Error(`${where} must be { "selector": "<css>" } or { "x", "y", "width", "height" } in pixels`);
};

const masksOf = (value: unknown, where: string): BaselineMask[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`${where}.masks must be a list`);
  return value.map((mask, index) => maskOf(mask, `${where}.masks[${index}]`));
};

const ruleOf = (value: unknown, where: string): BaselineRule => {
  if (!isRecord(value)) throw new Error(`${where} must be an object`);
  const tolerance = toleranceOf(value.tolerance, where);
  const threshold = thresholdOf(value.threshold, where);
  return {
    ...(tolerance === undefined ? {} : { tolerance }),
    ...(threshold === undefined ? {} : { threshold }),
    masks: masksOf(value.masks, where),
  };
};

const parseBaselineConfig = (raw: unknown): BaselineConfig => {
  if (raw === undefined || raw === null) return { tolerance: 0, threshold: 0, masks: [], captures: {} };
  if (!isRecord(raw)) throw new Error('the baseline config must be a JSON object');
  const captures = raw.captures ?? {};
  if (!isRecord(captures)) throw new Error('captures must map a capture name to its rule');
  return {
    tolerance: toleranceOf(raw.tolerance, 'the config') ?? 0,
    threshold: thresholdOf(raw.threshold, 'the config') ?? 0,
    masks: masksOf(raw.masks, 'the config'),
    captures: Object.fromEntries(Object.entries(captures).map(([key, rule]) => [key, ruleOf(rule, `captures.${key}`)])),
  };
};

export { parseBaselineConfig };
