/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = Object.freeze([
  {
    pattern: /\.update\(|\(s\)\s*=>\s*s\.update\b/g,
    near: /useWidgetLayoutStore/,
    message: 'the widget layout store has no update(id, patch) any more. Change the layout with change(fn) or setLayout and the Tessera edits (dockOnEdge, floatWidget, setFrame, setPopped).',
  },
  {
    pattern: /\blayout\.widgets\b/g,
    message: 'the widget layout is the v2 split tree ({ v: 2, dock, floating, popped, frame }). Read it with isWidgetOpen or placementOf from @drizztdourden08/tessera/composites.',
  },
  {
    pattern: /\b(?:topOffset|onUpdate)\s*=/g,
    near: /WidgetManager/,
    message: 'WidgetManager takes layout and onLayoutChange, and the main view as main; topOffset and onUpdate are gone.',
  },
  {
    pattern: /<StandardOverlays\b[^>]*\bwidgets\s*=/g,
    message: 'StandardOverlays no longer hosts the widgets. BrockApp docks them around the main view; give widgets to a module or render WidgetHost with main.',
  },
]);

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'widget-layout-v2',
  summary: 'The widget host docks widgets around the main view on the Tessera split tree; code that patched widgets or read the flat layout becomes to-dos. Saved layouts migrate on load.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
