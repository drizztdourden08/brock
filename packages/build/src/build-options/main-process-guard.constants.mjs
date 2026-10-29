/* @layer tooling-scripts @kind constants */
const RENDERER_PACKAGES = ['react', 'react-dom', '@drizztdourden08/brock-react'];
const TESSERA_PACKAGE = /^@drizztdourden08\/tessera(?:-[\w.-]+)?(?:\/|$)/;
const RENDERER_FOLDERS = ['screens', 'widgets', 'views', 'compounds', 'composites', 'primitives', 'stores', 'hooks', 'title-bar', 'tours', 'toolbars', 'startup'];
const RENDERER_FILES = ['src/main.tsx', 'src/index.html'];
const PACKAGE_SPEC = /^(?:@[\w~.-]+\/)?[\w~][\w~.-]*(?:\/[^*]*)?$/;
const MAX_REPORTED = 5;

export { MAX_REPORTED, PACKAGE_SPEC, RENDERER_FILES, RENDERER_FOLDERS, RENDERER_PACKAGES, TESSERA_PACKAGE };
