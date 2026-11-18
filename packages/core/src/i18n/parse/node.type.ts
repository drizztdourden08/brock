/* @layer core @kind types */
type FormatKind = 'number' | 'date' | 'time' | 'list';

type TextNode = { readonly t: 'text'; readonly value: string };
type PoundNode = { readonly t: 'pound' };
type ArgNode = { readonly t: 'arg'; readonly name: string };
type FormatNode = { readonly t: 'format'; readonly name: string; readonly kind: FormatKind; readonly style?: string | undefined };
type PluralNode = { readonly t: 'plural'; readonly name: string; readonly ordinal: boolean; readonly offset: number; readonly cases: NodeCases };
type SelectNode = { readonly t: 'select'; readonly name: string; readonly cases: NodeCases };
type TagNode = { readonly t: 'tag'; readonly name: string; readonly children: readonly MessageNode[] };

type MessageNode = TextNode | PoundNode | ArgNode | FormatNode | PluralNode | SelectNode | TagNode;

type NodeCases = Readonly<Record<string, readonly MessageNode[]>>;

export type { FormatKind, FormatNode, PluralNode, SelectNode, TagNode, MessageNode, NodeCases };
