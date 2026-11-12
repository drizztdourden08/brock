/* @layer renderer-components @kind types */
import type { ReactNode } from 'react';
import type { InputBinding } from '../../../bindings';

interface BindingCapture {
  binding: InputBinding;
  deviceKey: string;
  vendorId: string | null;
  productId: string | null;
}

interface BindingListenerProps {
  actionLabel: string;
  prompt: string;
  hint: string;
  extra?: ReactNode;
  onCapture: (capture: BindingCapture) => void;
  onCancel: () => void;
}

export type { BindingCapture, BindingListenerProps };
