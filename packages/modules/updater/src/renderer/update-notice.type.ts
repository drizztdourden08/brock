/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

type UpdateNoticeAction = 'update' | 'reinstall' | 'downgrade';

interface UpdateNoticeContext {
  version: string;
  currentVersion: string;
  action: UpdateNoticeAction;
  prerelease: boolean;
}

type UpdateNoticeRender = (context: UpdateNoticeContext) => ReactNode;

type UpdateNotice = UpdateNoticeRender | Readonly<Record<string, ReactNode>>;

export type { UpdateNotice, UpdateNoticeAction, UpdateNoticeContext, UpdateNoticeRender };
