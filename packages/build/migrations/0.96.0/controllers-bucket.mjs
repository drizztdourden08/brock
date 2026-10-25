/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const SCREENS_CONFIG = /(^|\/)src\/screens\/screens\.config\.ts$/;

const REMOVED_NAMES = [
  'InputTesterScreen', 'inputTesterScreen', 'INPUT_TESTER_SCREEN_ID', 'InputTester', 'InputTesterProps', 'DeviceCard', 'DeviceCardProps',
  'CalibrationPanel', 'CalibrationPanelAction', 'CalibrationPanelProps', 'CalibrationButtons', 'CalibrationControl', 'CalibrationReading',
  'CalibrationStickReading', 'CalibrationTriggerReading', 'inputFamilyOf',
];

const REMOVED = new RegExp(`\\b(${REMOVED_NAMES.join('|')})\\b`, 'g');

const IMPORT_RULES = [
  {
    pattern: REMOVED,
    near: /@drizztdourden08\/brock-input/,
    message: 'The input module no longer exports its tester pieces: the Controllers screen, InputTester, DeviceCard, CalibrationPanel and its types, and inputFamilyOf. The module now adds the Controllers hub (the id controllers) with a Directory page, a Logs page and a Diagnostics page. Open it with open(\'controllers\'). Add extra buttons with registerDeviceCardActions, and draw custom parts with StickPlot and PressedGrid.',
  },
  {
    pattern: /['"]input-tester['"]/g,
    message: 'The screen input-tester is gone. The Controllers entry of the Advanced menu opens the controllers hub, so point any link, menu change or open call at the id controllers.',
  },
  {
    pattern: /\bscreens:\s*\[\s*\]/g,
    near: /brock-input\/renderer/,
    message: 'An override of the input module that sets screens to an empty list is not needed any more. The module registers its own controllers bucket, so remove the override, and its menu redirect with it.',
  },
];

const CONFIG_RULES = [
  {
    pattern: /\bid:\s*['"]controllers['"]/g,
    message: 'The input module owns a bucket with the id controllers now, and an app that declares one fails at start. Remove this bucket or give it another id, and move its pages to the module.',
  },
];

const apply = ({ path, source }) => ({
  source,
  todos: patternTodos(source, SCREENS_CONFIG.test(path) ? [...IMPORT_RULES, ...CONFIG_RULES] : IMPORT_RULES),
});

const migration = Object.freeze({
  id: 'controllers-bucket',
  summary: 'The input module adds a controllers bucket (Directory, Logs and Diagnostics pages) in place of the input-tester screen, and drops InputTester, DeviceCard, CalibrationPanel, inputFamilyOf and the tester screen exports. Imports of them, a screens.config.ts bucket with the id controllers, and an input module override with an empty screens list become to-dos.',
  files: /(^|\/)src\/.+\.[cm]?[jt]sx?$/,
  apply,
});

export { migration };
