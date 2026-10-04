/* @layer core @kind types */
type ChannelKind = 'invoke' | 'send' | 'event';

type InvokeSignature = (...args: never[]) => Promise<unknown>;
type VoidSignature = (...args: never[]) => void;

interface ChannelDecl<K extends ChannelKind, C extends string, F> {
  readonly kind: K;
  readonly channel: C;
  readonly signature?: F;
}

type InvokeChannel<C extends string, F extends InvokeSignature> = ChannelDecl<'invoke', C, F>;
type SendChannel<C extends string, F extends VoidSignature> = ChannelDecl<'send', C, F>;
type EventChannel<C extends string, F extends VoidSignature> = ChannelDecl<'event', C, F>;

type AnyChannel = ChannelDecl<ChannelKind, string, unknown>;
type ChannelDecls = Record<string, AnyChannel>;

type ChannelsOfKind<D, K extends ChannelKind> = Extract<D[keyof D], ChannelDecl<K, string, unknown>>;

type ContractOf<D, K extends ChannelKind> = {
  [Ch in ChannelsOfKind<D, K> as Ch['channel']]: NonNullable<Ch['signature']>;
};

type InvokeContractOf<D> = ContractOf<D, 'invoke'>;
type SendContractOf<D> = ContractOf<D, 'send'>;
type EventContractOf<D> = ContractOf<D, 'event'>;

type ChannelMapOf<D, K extends ChannelKind> = {
  readonly [M in keyof D as D[M] extends ChannelDecl<K, string, unknown> ? M : never]: D[M] extends ChannelDecl<K, infer C, unknown> ? C : never;
};

interface ChannelMaps<D> {
  invoke: ChannelMapOf<D, 'invoke'>;
  send: ChannelMapOf<D, 'send'>;
  events: ChannelMapOf<D, 'event'>;
}

type DefinedChannels<D extends ChannelDecls> = D & { readonly maps: ChannelMaps<D> };

type SignatureOf<Ch> = Ch extends ChannelDecl<ChannelKind, string, infer F> ? NonNullable<F> : never;

type ChannelApi<D> = {
  [M in keyof D as D[M] extends ChannelDecl<'invoke' | 'send', string, unknown> ? M : never]: SignatureOf<D[M]>;
} & {
  [M in keyof D as D[M] extends ChannelDecl<'event', string, unknown> ? M : never]: (cb: SignatureOf<D[M]>) => () => void;
};

interface ChannelRef<C extends PropertyKey> {
  readonly channel: C;
}

export type {
  AnyChannel, ChannelApi, ChannelDecl, ChannelDecls, ChannelKind, ChannelMaps, ChannelRef, DefinedChannels, EventChannel, EventContractOf, InvokeChannel, InvokeContractOf, InvokeSignature,
  SendChannel, SendContractOf, VoidSignature,
};
