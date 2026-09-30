/* @layer tooling-scripts @kind logic */
const ROOT_CUSTOM = /^src\/screens\/[a-z][a-z0-9-]*\.custom\.tsx$/;

const apply = ({ path, source }) => ({ source, rename: path.replace(/\.custom\.tsx$/, '.layer.tsx'), todos: [] });

const migration = Object.freeze({
  id: 'custom-layer-rename',
  summary: 'A full-bleed screen at the root of src/screens is now <id>.layer.tsx; .custom.tsx names a custom page inside a bucket. Each root .custom.tsx is renamed.',
  files: ROOT_CUSTOM,
  apply,
});

export { migration };
