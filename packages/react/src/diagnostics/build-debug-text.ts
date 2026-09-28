/* @layer renderer-shell @kind logic */
import { debugSection } from './debug-section';
import type { DebugTextInput } from './diagnostics.type';
import { logSection } from './log-section';
import { renderSections } from './render-sections';
import { systemSections } from './system-sections';
import { windowSection } from './window-section';

const buildDebugText = (input: DebugTextInput): string => {
  const { productName, version, labels, info, system, window, logs, userAgent } = input;
  const header = [
    `${productName} debug info`,
    `Version: ${version}`,
    `Runtime: ${labels.runtime}`,
    `Engine: ${labels.engine}`,
    `Platform: ${labels.platform} (host ${info.host}, os ${info.os})`,
    `Form factor: ${info.formFactor}, input: ${info.input}, dev: ${info.isDev ? 'yes' : 'no'}`,
  ];
  const body = renderSections([
    ...(logs.length > 0 ? [logSection(logs)] : []),
    ...(system ? systemSections(system) : []),
    ...(window ? [windowSection(window)] : []),
    debugSection('User agent', [userAgent]),
  ]);
  return [header.join('\n'), body].join('\n\n');
};

export { buildDebugText };
