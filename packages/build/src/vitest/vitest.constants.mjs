/* @layer tooling-scripts @kind constants */
const ESBUILD_JSX = Object.freeze({ jsx: 'automatic', jsxImportSource: 'react' });
const INLINED_SOURCE = /^@drizztdourden08\//;
const SHARED_PACKAGES = ['react', 'react-dom', 'zustand', '@drizztdourden08/tessera'];

export { ESBUILD_JSX, INLINED_SOURCE, SHARED_PACKAGES };
