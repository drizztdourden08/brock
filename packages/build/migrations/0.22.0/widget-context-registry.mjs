/* @layer tooling-scripts @kind logic */
import { findJsxProps } from '../../src/upgrade/index.mjs';

const ELEMENTS = ['BrockApp', 'WidgetHost'];
const MESSAGE = 'widgetContext is deprecated: the context registry replaces it. Set the context where its state changes, contexts.set(\'session\', { active, data }) or useSetAppContext(\'session\', active, data) in a component, give each widget that needs it context: \'session\' in its meta, and drop this prop. Until then it keeps working: it drives the default context, which context-only widgets with no context of their own follow.';

const apply = ({ source }) => {
  const todos = ELEMENTS.flatMap((element) => findJsxProps(source, element, ['widgetContext'])).map((prop) => ({ line: prop.line, message: MESSAGE }));
  return { source, todos };
};

const migration = Object.freeze({
  id: 'widget-context-registry',
  summary: 'Widgets follow named contexts from one registry (contexts.set, useAppContext, useSetAppContext; a widget names its context in meta.context), for app and module widgets alike, in the main window and in popped windows. The widgetContext prop of BrockApp and WidgetHost still works, mapped onto the default context; each use becomes a to-do.',
  files: /(^|\/)src\/.+\.tsx$/,
  apply,
});

export { migration };
