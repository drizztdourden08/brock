/* @layer renderer-shell @kind hook */
import { createElement, useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import { useContextsStore } from '../../../contexts/useContextsStore';
import { KitLayer } from '../../KitLayer';
import { kitStatus } from '../../kits/kit-status';
import { kitMembers } from '../../kits/kit-members';
import { kitViewOf } from '../../kits/kit-view-of';
import { useWidgetKitStore } from '../../kits/useWidgetKitStore';
import type { KitStage, StageProps } from '../WidgetHost.type';
import { NO_CONTENT } from './useKitStage.constants';
import { useKitPopped } from './useKitPopped';

const picked = (all: Record<string, ReactNode>, ids: readonly string[]): Record<string, ReactNode> =>
  Object.fromEntries(ids.flatMap((id) => (id in all ? [[id, all[id]]] : [])));

const useKitStage = (normal: StageProps, extraOf: (id: string) => Partial<WidgetWindowOpen>): KitStage => {
  const active = useWidgetKitStore((s) => s.active);
  const kits = useWidgetKitStore((s) => s.kits);
  const members = useWidgetKitStore((s) => s.members);
  const views = useWidgetKitStore((s) => s.views);
  const setLayout = useWidgetKitStore((s) => s.setLayout);
  const contexts = useContextsStore((s) => s.contexts);
  const developerTools = useDeveloperTools();
  const kit = useMemo(() => kits.find((each) => each.id === active) ?? null, [kits, active]);
  const status = kit ? kitStatus(kit, contexts, developerTools) : null;
  const shown = status?.shown ?? true;
  const reason = status?.reason ?? null;
  const view = useMemo(() => (kit ? kitViewOf(kit.id, { kits, members, views }) : null), [kit, kits, members, views]);
  const definitions = useMemo(() => (kit ? kitMembers(kit.id, members) : []), [kit, members]);
  const ids = useMemo(() => definitions.map((def) => def.id), [definitions]);
  const children = useMemo(() => (reason === null ? picked(normal.children, ids) : NO_CONTENT), [reason, normal.children, ids]);
  const settingsContent = useMemo(() => picked(normal.settingsContent ?? NO_CONTENT, ids), [normal.settingsContent, ids]);
  const { popped, onPopOut } = useKitPopped({ definitions, layout: view?.layout ?? null, blocked: reason !== null, contextActive: normal.contextActive, extraOf });
  const drag = normal.externalDrag;
  const externalDrag = drag && ids.includes(drag.id) ? drag : null;
  const close = useCallback(() => useWidgetKitStore.getState().close(), []);

  useEffect(() => {
    if (!shown) close();
  }, [shown, close]);

  const hidden = view?.hidden;
  const layer = useMemo(() => (kit && hidden ? createElement(KitLayer, { kit, hidden, reason, onClose: close }) : null), [kit, hidden, reason, close]);
  if (!kit || !view) return { open: false, props: normal, layer: null, popped };
  return {
    open: true,
    layer,
    popped,
    props: { definitions, layout: view.layout, onLayoutChange: setLayout, contextActive: normal.contextActive, pageOpen: false, children, settingsContent, externalDrag, onPopOut },
  };
};

export { useKitStage };
