/* @layer tooling-scripts @kind logic */
import { STATUS_WIDTH } from './doctor.constants.mjs';

/**
 * @typedef {import('../platform.type.mjs').DoctorResult & { label: string }} LabelledResult
 * @typedef {{ title: string, results: LabelledResult[] }} DoctorSection
 */

const resultLines = (result, width) => {
  const head = `    ${result.status.padEnd(STATUS_WIDTH)}${result.label.padEnd(width)}  ${result.detail ?? ''}`.trimEnd();
  const install = result.status === 'missing' && result.install ? [`    ${' '.repeat(STATUS_WIDTH)}install: ${result.install}`] : [];
  return [head, ...install];
};

const sectionLines = (section, width) => [
  `  ${section.title}`,
  ...(section.results.length ? section.results.flatMap((result) => resultLines(result, width)) : ['    nothing beyond what every app needs']),
];

/**
 * @param {DoctorSection[]} sections
 * @returns {{ ok: boolean, missing: string[], lines: string[] }}
 */
const doctorReport = (sections) => {
  const results = sections.flatMap((section) => section.results);
  const width = Math.max(0, ...results.map((result) => result.label.length));
  const missing = results.filter((result) => result.status === 'missing').map((result) => result.label);
  const summary = missing.length
    ? `${missing.length} missing: ${missing.join(', ')}. Install them, then run doctor again.`
    : 'Everything these platforms need on this machine is installed.';
  return { ok: missing.length === 0, missing, lines: [...sections.flatMap((section) => sectionLines(section, width)), '', summary] };
};

export { doctorReport };
