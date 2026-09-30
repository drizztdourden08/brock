/* @layer tooling-scripts @kind logic */

const REPLACEMENTS = Object.freeze({
  TitleBar: 'WindowTitleBar from @drizztdourden08/tessera/composites (BrockApp already draws it)',
  WindowControls: 'the window props of WindowTitleBar from @drizztdourden08/tessera/composites',
  InstanceBadge: 'the brand.instance prop of WindowTitleBar, or Badge with pulse',
  About: 'AboutPanel from @drizztdourden08/tessera/composites',
  ProfileCard: 'ProfilePicker from @drizztdourden08/tessera/composites',
  CreateProfileForm: 'InlineCreateForm from @drizztdourden08/tessera/composites',
  ScreenRail: 'SectionNav variant="rail" from @drizztdourden08/tessera/composites',
  SettingsPage: 'SettingsPage from @drizztdourden08/tessera/composites',
  SearchPalette: 'CommandPalette from @drizztdourden08/tessera/composites (BrockApp already mounts the palette)',
  partitionByLock: 'the lock field of SettingsSection rows in @drizztdourden08/tessera/composites',
});

const IMPORT = /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*['"]@drizztdourden08\/brock-react['"]/g;

const lineAt = (source, index) => source.slice(0, index).split('\n').length;

const namesIn = (list) => list.split(',').map((part) => part.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);

const apply = ({ source }) => {
  const todos = [];
  for (const match of source.matchAll(IMPORT)) {
    for (const name of namesIn(match[1])) {
      if (!REPLACEMENTS[name]) continue;
      todos.push({ line: lineAt(source, match.index), message: `${name} is no longer exported by brock-react. Use ${REPLACEMENTS[name]}.` });
    }
  }
  return { source, todos };
};

const migration = Object.freeze({
  id: 'removed-shell-exports',
  summary: 'brock-react no longer exports the shell parts Tessera composites replaced; imports of them become to-dos.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
