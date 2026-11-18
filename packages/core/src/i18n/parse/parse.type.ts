/* @layer core @kind types */
import type { MessageNode } from './node.type';

type Cursor = { readonly src: string; pos: number };

type ParseCtx = {
  readonly c: Cursor;
  readonly pound: boolean;
  readonly body: (ctx: ParseCtx) => readonly MessageNode[];
};

type ArgumentParser = (ctx: ParseCtx, name: string, type: string) => MessageNode;

export type { Cursor, ParseCtx, ArgumentParser };
