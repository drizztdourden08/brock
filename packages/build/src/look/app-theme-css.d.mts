/* @layer tooling-scripts @kind types */

/** The app theme stylesheet, absolute: theme.css of the tessera.config.json at or above rootDir, else rootDir/src/theme.css. Throws, naming the file, when that config is wrong. */
declare const appThemeCss: (rootDir: string) => string;

export { appThemeCss };
