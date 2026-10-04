/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOM = 0xfeff;
const DATA_DIR = join('.user-data', 'Data');
const GROUP_FILE = join(DATA_DIR, 'config', 'window-group.json');
const VIEWS_FILE = join(DATA_DIR, 'ui-views.json');

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const withoutGroup = (entry) =>
  (isRecord(entry) && 'group' in entry ? Object.fromEntries(Object.entries(entry).filter(([key]) => key !== 'group')) : entry);

const dropFromLayout = (layout) => {
  if (!isRecord(layout)) return layout;
  const popped = Array.isArray(layout.popped) ? layout.popped.map(withoutGroup) : layout.popped;
  const memory = isRecord(layout.poppedMemory)
    ? Object.fromEntries(Object.entries(layout.poppedMemory).map(([id, entry]) => [id, withoutGroup(entry)]))
    : layout.poppedMemory;
  return { ...layout, popped, ...(memory === undefined ? {} : { poppedMemory: memory }) };
};

const dropFromViews = (views) =>
  Object.fromEntries(Object.entries(views).map(([key, value]) => [key, isRecord(value) && 'widgetLayout' in value ? { ...value, widgetLayout: dropFromLayout(value.widgetLayout) } : value]));

const cleanViews = (rootDir) => {
  const file = join(rootDir, VIEWS_FILE);
  if (!existsSync(file)) return false;
  try {
    const raw = readFileSync(file, 'utf8');
    const views = JSON.parse(raw.charCodeAt(0) === BOM ? raw.slice(1) : raw);
    if (!isRecord(views)) return false;
    const next = `${JSON.stringify(dropFromViews(views), null, 2)}\n`;
    if (JSON.stringify(JSON.parse(next)) === JSON.stringify(views)) return false;
    writeFileSync(file, next, 'utf8');
    return true;
  } catch {
    return false;
  }
};

const dropWindowGroupsStep = ({ rootDir }) => {
  const touched = [];
  const groupFile = join(rootDir, GROUP_FILE);
  if (existsSync(groupFile)) {
    rmSync(groupFile, { force: true });
    touched.push(GROUP_FILE.replace(/\\/g, '/'));
  }
  if (cleanViews(rootDir)) touched.push(VIEWS_FILE.replace(/\\/g, '/'));
  return { touched, todos: [] };
};

const migration = Object.freeze({
  id: 'drop-window-groups',
  summary: 'Manual window groups are gone: snapped windows form a cluster on their own. The dev data under .user-data loses config/window-group.json and the group field of each saved popped widget; an installed app drops both itself on its next start.',
  workspace: dropWindowGroupsStep,
});

export { migration };
