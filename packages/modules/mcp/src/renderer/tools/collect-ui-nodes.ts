/* @layer renderer-shell @kind logic */
import type { McpData } from '../../mcp.type';
import { READ_UI_SELECTOR } from './read-ui.constants';
import type { UiNodes } from './read-ui.type';
import { uiNodeOf } from './ui-node-of';

const shown = (el: Element): boolean => {
  const rect = el.getBoundingClientRect();
  const inside = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
  return inside && el.closest('[aria-hidden="true"], [inert]') === null && el.checkVisibility({ visibilityProperty: true, opacityProperty: true });
};

const matches = (node: McpData, query: string): boolean =>
  query === '' || [node.role, node.name].some((text) => typeof text === 'string' && text.toLowerCase().includes(query));

const collectUiNodes = (root: ParentNode, query: string, max: number): UiNodes => {
  const found = [...root.querySelectorAll(READ_UI_SELECTOR)].filter(shown).map(uiNodeOf).filter((node) => matches(node, query));
  return { nodes: found.slice(0, max), truncated: found.length > max };
};

export { collectUiNodes };
