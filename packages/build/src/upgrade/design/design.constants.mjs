/* @layer tooling-scripts @kind constants */
const SOURCE_FILE = /\.(?:[cm]?[jt]sx?|css)$/;
const PATH_REFERENCE = /(['"])(\.{1,2}\/[^'"\n]*|@app\/[^'"\n]*)\1/g;
const BARE_IMPORT = /(?:\bfrom|^\s*import)\s*(['"])([^'".\n][^'"\n]*)\1/gm;
const IMPORT_FROM_BEFORE = /\bfrom\s*$/;
const APP_ALIAS = '@app/';
const COMPOUNDS = 'compounds';
const PART_DIRS = Object.freeze(['primitives', 'composites', 'compounds', 'views']);
const BROCK_APP_DIRS = Object.freeze(['screens', 'widgets', 'state', 'ipc', 'boot', 'styles', 'assets', 'fonts']);
const DESIGN_DEV_TOOLS = Object.freeze(['@drizztdourden08/brock-lint-config', '@types/react', '@types/react-dom', 'eslint', 'stylelint', 'typescript', 'vite']);
const DESIGN_LINT = 'tsc --noEmit && eslint . && stylelint "src/**/*.css" --allow-empty-input';
const ONE_REACT = Object.freeze({
  react: ['./node_modules/@types/react'],
  'react/*': ['./node_modules/@types/react/*'],
  'react-dom': ['./node_modules/@types/react-dom'],
  'react-dom/*': ['./node_modules/@types/react-dom/*'],
});
const DESIGN_TSCONFIG = Object.freeze({ extends: '@drizztdourden08/brock-lint-config/tsconfig/react.json', compilerOptions: { paths: ONE_REACT }, include: ['src'] });
const DESIGN_KNIP = Object.freeze({ project: ['src/**/*.{ts,tsx}'], ignoreDependencies: ['@drizztdourden08/tessera', '@types/react-dom', 'vite'] });
const BARREL_HEADER ='/* @layer renderer-app @kind barrel */';
const EMPTY_MODULE = 'export {};';

export {
  APP_ALIAS,
  BARE_IMPORT,
  BARREL_HEADER,
  BROCK_APP_DIRS,
  COMPOUNDS,
  DESIGN_DEV_TOOLS,
  DESIGN_KNIP,
  DESIGN_LINT,
  DESIGN_TSCONFIG,
  EMPTY_MODULE,
  IMPORT_FROM_BEFORE,
  PART_DIRS,
  PATH_REFERENCE,
  SOURCE_FILE,
};
