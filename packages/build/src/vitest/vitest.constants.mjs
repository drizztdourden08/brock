/* @layer tooling-scripts @kind constants */
const ESBUILD_JSX = Object.freeze({ jsx: 'automatic', jsxImportSource: 'react' });
const INLINED_SOURCE = /^@drizztdourden08\//;
const SHARED_PACKAGES = ['react', 'react-dom', 'zustand', '@drizztdourden08/tessera'];
const REACT_PACKAGE = '@drizztdourden08/brock-react';
const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies'];

export { ESBUILD_JSX, INLINED_SOURCE, SHARED_PACKAGES, REACT_PACKAGE, DEPENDENCY_FIELDS };
