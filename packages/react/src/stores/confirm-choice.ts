/* @layer renderer-shell @kind logic */
import type { ConfirmChoiceOptions } from './dialog.type';
import { useDialogStore } from './useDialogStore';

const confirmChoice = <T extends string>(options: ConfirmChoiceOptions<T>): Promise<T | null> =>
  new Promise((resolve) => {
    const { choices, initial, ...rest } = options;
    const store = useDialogStore.getState();
    store.dismiss();
    store.show({
      ...rest,
      choices,
      choice: initial,
      onConfirm: () => {
        const picked = useDialogStore.getState().dialog?.choice;
        useDialogStore.setState({ dialog: null });
        resolve(choices.find((entry) => entry.value === picked)?.value ?? initial);
      },
      onCancel: () => resolve(null),
    });
  });

export { confirmChoice };
