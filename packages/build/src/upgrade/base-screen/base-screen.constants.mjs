/* @layer tooling-scripts @kind constants */
const NAMED_IMPORT = /^import\s+(type\s+)?\{([^}]*)\}\s*from\s*['"]([^'"]+)['"];?[ \t]*\n?/gm;
const DEFINE_SCREEN = /\bdefineScreen\(\s*\{/g;
const MODULE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];
const SCREENS_FOLDER = 'src/screens';
const MAIN_FILE = /(^|\/)src\/main\.tsx$/;
const CONVENTION = 'The base screen is a file now: src/screens/<id>.base.tsx default-exports its component, `meta` holds its title and icon, and brock sync draws it under every hub; BrockApp no longer takes it through screens and home.';

export { CONVENTION, DEFINE_SCREEN, MAIN_FILE, MODULE_SUFFIXES, NAMED_IMPORT, SCREENS_FOLDER };
