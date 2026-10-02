/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { tesseraRenamesStep } from '../src/upgrade/tessera/tessera-renames-step.mjs';

const RELEASE = {
  version: 'next',
  cssCustomProperties: { '--c-gold': '--c-primary', '--c-gold-bright': '--c-primary-bright' },
  components: { TabBar: 'Tabs', RangeSlider: 'Slider (with range; see MIGRATION.md)' },
  cssClasses: {
    'tab-bar': 'tabs',
    'range-slider__input--top': 'slider__input--top',
    'range-slider__input': 'slider__input',
    'range-slider': 'slider slider--range',
    'search-results__count': 'search-results__summary (the summary text in the fixed head)',
  },
  propValues: { 'ProgressBar.variant': { gold: 'primary' }, WidgetVisibility: { 'game-only': 'context-only' } },
  props: {
    'TabBar.items': 'Tabs.tabs',
    'RangeSlider.step': 'Slider.keyStep',
    'Slider.mute': 'VolumeControl (see MIGRATION.md)',
    'WidgetManager.vanillaSafe + WidgetManager.settings': 'WidgetManager.resolveDisabled (callback, see MIGRATION.md)',
  },
  removedExports: { PatternInputProps: 'replaced by DynamicInputProps', 'WizardStep (type)': 'replaced by WizardStepDef' },
};

const VIEW = [
  "import { ProgressBar, RangeSlider, TabBar } from '@drizztdourden08/tessera/primitives';",
  "import { WidgetManager } from '@drizztdourden08/tessera/composites';",
  "import type { PatternInputProps, WidgetVisibility, WizardStep } from '@drizztdourden08/tessera/composites';",
  "import { Slider } from './Slider';",
  '',
  "const show: WidgetVisibility = 'game-only';",
  "const other = 'game-only';",
  'type TabsProps = React.ComponentProps<typeof TabBar>;',
  'const View = ({ cut }: { cut: string }) => (',
  "  <div className={`tab-bar tab-bar--wide ${cut}`} style={{ color: 'var(--c-gold)', background: 'var(--c-gold-bright)' }}>",
  '    <TabBar items={[]} />',
  '    <ProgressBar variant="gold" value={1} />',
  "    <ProgressBar variant={cut ? 'gold' : 'danger'} value={1} />",
  '    <RangeSlider step={2} />',
  '    <Slider step={2} mute />',
  '    <WidgetManager vanillaSafe settings={{}} />',
  '    <span className="range-slider range-slider__input--top range-slider__input" />',
  '    <span className={`tab-bar__${cut}`} />',
  '    <p>tab-bar --c-gold</p>',
  '  </div>',
  ');',
  "const found = document.querySelector('.tab-bar .range-slider__input-extra');",
  '',
].join('\n');

const CSS = [
  '.tab-bar { color: var(--c-gold); }',
  '.tab-bar__strip, .range-slider__input--top, .range-slider__input:hover { --local: var(--c-gold-bright); }',
  'div.range-slider > .search-results__count { background: url(./tab-bar.png); }',
  '/* .tab-bar in a comment stays */',
  '.tab-barx { color: red; }',
  '',
].join('\n');

const TESSERA = join('node_modules', '@drizztdourden08', 'tessera');
const state = { root: '', first: null, second: null, after: {} };

const writeApp = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-tessera-code-'));
  for (const dir of ['src', TESSERA]) mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(join(root, 'package.json'), '{ "name": "app" }\n');
  writeFileSync(join(root, TESSERA, 'package.json'), '{ "name": "@drizztdourden08/tessera", "version": "0.3.0" }\n');
  writeFileSync(join(root, TESSERA, 'RENAMES.json'), JSON.stringify({ releases: [RELEASE] }));
  writeFileSync(join(root, 'src', 'view.tsx'), VIEW);
  writeFileSync(join(root, 'src', 'view.css'), CSS);
  return root;
};

const lines = (run) => run.applied.flatMap((entry) => entry.todos.map((todo) => `${todo.file}:${todo.line} ${todo.message}`));

beforeAll(() => {
  state.root = writeApp();
  state.first = tesseraRenamesStep({ rootDir: state.root });
  state.after = { view: readFileSync(join(state.root, 'src', 'view.tsx'), 'utf8'), css: readFileSync(join(state.root, 'src', 'view.css'), 'utf8') };
  state.second = tesseraRenamesStep({ rootDir: state.root });
});

afterAll(() => rmSync(state.root, { recursive: true, force: true }));

describe('the Tessera renames in scripts', () => {
  it('renames a component in its Tessera import, its JSX and its type references', () => {
    expect(state.after.view).toContain("import { ProgressBar, RangeSlider, Tabs } from '@drizztdourden08/tessera/primitives';");
    expect(state.after.view).toContain('React.ComponentProps<typeof Tabs>');
    expect(state.after.view).toContain('<Tabs tabs={[]} />');
  });

  it('renames props and prop values on the Tessera component only', () => {
    expect(state.after.view).toContain('<ProgressBar variant="primary" value={1} />');
    expect(state.after.view).toContain("<ProgressBar variant={cut ? 'primary' : 'danger'} value={1} />");
    expect(state.after.view).toContain('<Slider step={2} mute />');
    expect(state.after.view).toContain('<RangeSlider step={2} />');
  });

  it('renames literals typed with a Tessera type; another string with an old value is a to-do', () => {
    expect(state.after.view).toContain("const show: WidgetVisibility = 'context-only';");
    expect(state.after.view).toContain("const other = 'game-only';");
    expect(lines(state.first)).toContainEqual(expect.stringMatching(/^src\/view\.tsx:7 .*WidgetVisibility value 'game-only'/));
  });

  it('renames custom properties in strings, classes in class lists and selectors, never JSX text', () => {
    expect(state.after.view).toContain("style={{ color: 'var(--c-primary)', background: 'var(--c-primary-bright)' }}");
    expect(state.after.view).toContain('className={`tabs tab-bar--wide ${cut}`}');
    expect(state.after.view).toContain('<span className="slider slider--range slider__input--top slider__input" />');
    expect(state.after.view).toContain('<span className={`tab-bar__${cut}`} />');
    expect(state.after.view).toContain('<p>tab-bar --c-gold</p>');
    expect(state.after.view).toContain("document.querySelector('.tabs .range-slider__input-extra')");
  });

  it('leaves a to-do with the note where the new name is not a name', () => {
    expect(lines(state.first)).toEqual(expect.arrayContaining([
      expect.stringMatching(/^src\/view\.tsx:1 .*component RangeSlider is now "Slider \(with range; see MIGRATION\.md\)"/),
      expect.stringMatching(/^src\/view\.tsx:14 .*component RangeSlider is now/),
      expect.stringMatching(/^src\/view\.tsx:14 .*prop RangeSlider\.step is now "Slider\.keyStep"/),
      expect.stringMatching(/^src\/view\.tsx:16 .*WidgetManager\.vanillaSafe \+ WidgetManager\.settings is now/),
      expect.stringMatching(/^src\/view\.tsx:3 .*no longer exports PatternInputProps: replaced by DynamicInputProps/),
      expect.stringMatching(/^src\/view\.tsx:3 .*no longer exports WizardStep \(type\)/),
      expect.stringMatching(/^src\/view\.tsx:10 .*tab-bar--wide is built from it/),
      expect.stringMatching(/^src\/view\.tsx:18 .*class tab-bar to tabs; tab-bar__/),
      expect.stringMatching(/^src\/view\.tsx:22 .*range-slider__input-extra is built from it/),
    ]));
    expect(lines(state.first).filter((todo) => todo.includes('Slider.mute'))).toEqual([]);
  });
});

describe('the Tessera renames in stylesheets, and a second replay', () => {
  it('renames selectors with a boundary, longer keys first, and custom properties anywhere', () => {
    expect(state.after.css).toBe([
      '.tabs { color: var(--c-primary); }',
      '.tab-bar__strip, .slider__input--top, .slider__input:hover { --local: var(--c-primary-bright); }',
      'div.slider.slider--range > .search-results__count { background: url(./tab-bar.png); }',
      '/* .tab-bar in a comment stays */',
      '.tab-barx { color: red; }',
      '',
    ].join('\n'));
    expect(lines(state.first)).toEqual(expect.arrayContaining([
      expect.stringMatching(/^src\/view\.css:2 .*tab-bar__strip is built from it/),
      expect.stringMatching(/^src\/view\.css:3 .*class search-results__count is now "search-results__summary \(the summary text in the fixed head\)"/),
    ]));
  });

  it('changes nothing the second time and finds the same to-dos', () => {
    expect(state.first.applied[0].touched).toEqual(['src/view.css', 'src/view.tsx']);
    expect(state.second.applied[0].touched).toEqual([]);
    expect(readFileSync(join(state.root, 'src', 'view.tsx'), 'utf8')).toBe(state.after.view);
    expect(lines(state.second)).toEqual(lines(state.first));
  });
});
