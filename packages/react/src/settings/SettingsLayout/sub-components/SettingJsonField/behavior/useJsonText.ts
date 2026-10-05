/* @layer renderer-shell @kind hook */
import { useEffect, useRef, useState } from 'react';
import type { SettingJsonShape } from '../../../../settings.type';
import type { JsonProblem, JsonText } from '../SettingJsonField.type';
import { formatJson } from './format-json';
import { readJsonText } from './read-json-text';

const useJsonText = (value: unknown, onChange: (next: unknown) => void, shape: SettingJsonShape | undefined): JsonText => {
  const shown = formatJson(value);
  const [text, setText] = useState(shown);
  const [problem, setProblem] = useState<JsonProblem | null>(null);
  const sent = useRef(shown);

  useEffect(() => {
    if (shown === sent.current) return;
    sent.current = shown;
    setText(shown);
    setProblem(null);
  }, [shown]);

  const edit = (next: string): void => {
    setText(next);
    const read = readJsonText(next, shape);
    setProblem(read.problem);
    if (read.problem !== null) return;
    sent.current = formatJson(read.value);
    onChange(read.value);
  };

  return { text, edit, problem };
};

export { useJsonText };
