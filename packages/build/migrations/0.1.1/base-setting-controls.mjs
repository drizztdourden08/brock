/* @layer tooling-scripts @kind logic */
const controls = {
  windowMode: "{ kind: 'choice', options: [{ value: 'windowed', label: 'Windowed' }, { value: 'borderless', label: 'Borderless' }, { value: 'fullscreen', label: 'Fullscreen' }] }",
  masterVolume: "{ kind: 'range', min: 0, max: 1, step: 0.05 }",
};

const settingKey = /\bkey:\s*['"](windowMode|masterVolume)['"]/;
const oneLineItem = /^(\s*\{.*?)\s*\}(,?\s*)$/;

const migrateLine = (line, index, todos) => {
  const key = settingKey.exec(line)?.[1];
  if (!key || /\bcontrol\s*:/.test(line)) return line;
  if (oneLineItem.test(line)) return line.replace(oneLineItem, `$1, control: ${controls[key]} }$2`);
  todos.push({ line: index + 1, message: `The ${key} setting row draws no control since 0.1.1. Add control: ${controls[key]} to its item.` });
  return line;
};

const apply = ({ source }) => {
  const todos = [];
  const lines = source.split('\n').map((line, index) => migrateLine(line, index, todos));
  return { source: lines.join('\n'), todos };
};

const migration = Object.freeze({
  id: 'base-setting-controls',
  summary: 'A setting row that is not a boolean needs a control; windowMode gets a choice and masterVolume a range.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
