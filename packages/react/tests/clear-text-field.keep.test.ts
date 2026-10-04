/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { clearTextField } from '../src/escape/clear-text-field';

class FakeField {
  readonly events: string[] = [];
  #value: string;

  constructor(readonly tagName: string, value: string, readonly type = 'text', readonly readOnly = false) {
    this.#value = value;
  }

  get value(): string { return this.#value; }

  set value(next: string) { this.#value = next; }

  dispatchEvent(event: Event): boolean {
    this.events.push(`${event.type}${event.bubbles ? ':bubbles' : ''}`);
    return true;
  }
}

const press = (target: unknown): boolean => clearTextField(target as EventTarget);

describe('clearTextField (Esc in a text field)', () => {
  it('clears a non-empty text input on the first Esc and fires a bubbling input event', () => {
    const field = new FakeField('INPUT', 'multi', 'search');
    expect(press(field)).toBe(true);
    expect(field.value).toBe('');
    expect(field.events).toEqual(['input:bubbles']);
  });

  it('lets the second Esc through to close the layer once the field is empty', () => {
    const field = new FakeField('INPUT', 'multi');
    press(field);
    expect(press(field)).toBe(false);
  });

  it('clears a textarea too', () => {
    const field = new FakeField('TEXTAREA', 'notes');
    expect(press(field)).toBe(true);
    expect(field.value).toBe('');
  });

  it('leaves checkboxes, read-only fields and other targets alone', () => {
    expect(press(new FakeField('INPUT', 'on', 'checkbox'))).toBe(false);
    expect(press(new FakeField('INPUT', 'fixed', 'text', true))).toBe(false);
    expect(press(new FakeField('BUTTON', 'Run'))).toBe(false);
    expect(press(null)).toBe(false);
  });
});
