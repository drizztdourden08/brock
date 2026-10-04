/* @layer tooling-scripts @kind logic */
import { MAIN_FILE } from '../../src/upgrade/base-screen/base-screen.constants.mjs';
import { migrateBaseScreen } from '../../src/upgrade/base-screen/migrate-base-screen.mjs';
import { ownedFiles } from '../../src/upgrade/owned-files.mjs';

const baseScreenStep = ({ rootDir }) => {
  const results = ownedFiles(rootDir).filter((file) => MAIN_FILE.test(file)).map((file) => migrateBaseScreen(rootDir, file));
  return { touched: results.flatMap((result) => result.touched), todos: results.flatMap((result) => result.todos) };
};

const migration = Object.freeze({
  id: 'base-screen-file',
  summary: 'The base screen drawn under the hubs is a file now, src/screens/<id>.base.tsx. A hand defineScreen passed through BrockApp screens and named by home moves to that file when it is only a title, an icon and a component: the file default-exports the component with the title and icon in meta, the defineScreen leaves the screens list (the list goes when it is empty), and home and the emptied screens prop leave BrockApp. Any other base screen becomes a to-do naming its file.',
  workspace: baseScreenStep,
});

export { migration };
