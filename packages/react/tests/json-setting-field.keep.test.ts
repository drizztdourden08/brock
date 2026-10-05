/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SettingJsonField } from '../src/settings/SettingsLayout/sub-components/SettingJsonField';
import { readJsonText } from '../src/settings/SettingsLayout/sub-components/SettingJsonField/behavior/read-json-text';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let root: Root | null = null;

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = '';
});

const mount = (value: unknown, onChange: (next: unknown) => void, shape?: 'object' | 'array' | 'any'): HTMLTextAreaElement => {
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root?.render(createElement(SettingJsonField, { control: { kind: 'json', shape }, value, onChange, label: 'Extra', disabled: false })));
  const field = host.querySelector('textarea');
  if (!field) throw new Error('no textarea');
  return field;
};

const type = (field: HTMLTextAreaElement, text: string): void => {
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
  act(() => {
    setter?.call(field, text);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

describe('readJsonText', () => {
  it('parses JSON and checks the shape', () => {
    expect(readJsonText('{ "speed": 2 }', 'object')).toEqual({ value: { speed: 2 }, problem: null });
    expect(readJsonText('[1]', 'any')).toEqual({ value: [1], problem: null });
    expect(readJsonText('[1]', 'object').problem).toMatchObject({ message: 'Expected a JSON object, in braces.', line: 1 });
    expect(readJsonText('{}', 'array').problem?.message).toBe('Expected a JSON array, in brackets.');
  });

  it('reads the line from the message JSON.parse throws', () => {
    const read = readJsonText('{\n  "a": 1,\n  "b" 2\n}');
    expect(read.problem?.message).toMatch(/JSON/);
    expect(read.problem?.line).toBe(3);
  });
});

describe('SettingJsonField', () => {
  it('shows the value as formatted JSON in an editable CodeBlock named by the row', () => {
    const field = mount({ speed: 2 }, vi.fn());
    expect(field.value).toBe('{\n  "speed": 2\n}');
    expect(field.getAttribute('aria-label')).toBe('Extra');
  });

  it('stores the parsed value, and marks the field with the problem line while the text does not parse', () => {
    const onChange = vi.fn();
    const field = mount({ speed: 2 }, onChange, 'object');
    type(field, '{\n  "speed": 3\n}');
    expect(onChange).toHaveBeenLastCalledWith({ speed: 3 });
    type(field, '{\n  "speed": 3,\n}');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[role="alert"]')?.textContent).toMatch(/JSON/);
    expect(field.getAttribute('aria-invalid')).toBe('true');
    expect(field.getAttribute('aria-describedby')).toBe(document.querySelector('[role="alert"]')?.id);
  });
});
