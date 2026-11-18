/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useText } from '../i18n';
import type { MenuEntry, MenuItem } from '../menu/menu.type';
import { RECENT_MENU_TEXT } from './documents.constants';
import type { UseRecentMenuOptions } from './documents.type';
import { useRecentDocuments } from './useRecentDocuments';

const useRecentMenu = ({ onOpen, label }: UseRecentMenuOptions): MenuItem => {
  const text = useText();
  const { recent, clear, open } = useRecentDocuments();
  return useMemo((): MenuItem => {
    const items: MenuEntry[] = recent.map((entry) => ({
      key: `recent:${entry.path}`,
      label: entry.name,
      description: entry.path,
      onClick: () => void open(entry.path).then((path) => (path === null ? undefined : onOpen(path))),
    }));
    const children: MenuEntry[] = items.length === 0
      ? [{ key: 'recent-none', label: text(RECENT_MENU_TEXT.none), disabled: true }]
      : [...items, 'separator', { key: 'recent-clear', label: text(RECENT_MENU_TEXT.clear), onClick: () => void clear() }];
    return { key: 'recent-documents', label: label ?? text(RECENT_MENU_TEXT.label), children };
  }, [recent, label, open, clear, onOpen, text]);
};

export { useRecentMenu };
