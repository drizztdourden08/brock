/* @layer core @kind types */
import type { MessageNode } from '../parse/node.type';
import type { MessageValues } from '../message-values.type';

type TagFn = (chunks: readonly unknown[]) => unknown;

type Tags = Readonly<Record<string, TagFn>>;

type Env = {
  readonly values: MessageValues;
  readonly locale: string;
  readonly tags?: Tags | undefined;
  readonly pound?: string;
};

type Compiled = (env: Env) => readonly unknown[];

type NodesCompiler = (nodes: readonly MessageNode[]) => Compiled;

export type { TagFn, Tags, Env, Compiled, NodesCompiler };
