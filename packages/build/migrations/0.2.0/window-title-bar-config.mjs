/* @layer tooling-scripts @kind logic */
import { findJsxProps, patternTodos } from '../../src/upgrade/index.mjs';

const REMOVED = Object.freeze({
  menuOpen: 'WindowTitleBar owns the menu open state now; drop menuOpen.',
  menuAnchorRef: 'WindowTitleBar anchors its own hamburger menu; drop menuAnchorRef.',
  onPinToggle: "the pin reports to onControl('pin'); hide it with controls={{ pin: false }}.",
  onFullscreenToggle: "full screen reports to onControl('fullscreen'); hide it with controls={{ fullscreen: false }}.",
  onMinimize: "minimize reports to onControl('minimize'); hide it with controls={{ minimize: false }}.",
  onMaximizeToggle: "maximize reports to onControl('maximize'); hide it with controls={{ maximize: false }}.",
  onClose: "close reports to onControl('close').",
});

const RULES = Object.freeze([
  {
    pattern: /\bWindowControlsState\b/g,
    message: 'WindowControlsState is gone from Tessera. Use WindowControlsConfig for controls and WindowControl for the onControl argument.',
  },
]);

const MENU_NODE = /^menu\s*=\s*\{[^}]*?</;

const propTodo = ({ name, line }) => ({ line, message: `WindowTitleBar no longer takes ${name}: ${REMOVED[name]}` });

const menuNodeTodo = ({ line }) => ({
  line,
  message: 'WindowTitleBar takes menu as MenuGroup[] and draws the hamburger itself. Pass the groups (toMenuGroups from @drizztdourden08/brock-react in a Brock app) in place of a trigger node.',
});

const apply = ({ source }) => {
  const props = findJsxProps(source, 'WindowTitleBar', [...Object.keys(REMOVED), 'menu']);
  const removed = props.filter((prop) => prop.name !== 'menu').map(propTodo);
  const nodes = props.filter((prop) => prop.name === 'menu' && MENU_NODE.test(source.slice(prop.start, prop.end))).map(menuNodeTodo);
  return { source, todos: [...removed, ...nodes, ...patternTodos(source, RULES)] };
};

const migration = Object.freeze({
  id: 'window-title-bar-config',
  summary: 'Tessera WindowTitleBar builds its menu from MenuGroup[] and reports every button to onControl; the removed props become to-dos.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
