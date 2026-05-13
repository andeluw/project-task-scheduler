import useDialogStore from '@/store/useDialogStore';

/** Hook to use dialog cleanly */
export function useDialog() {
  return useDialogStore.useDialog();
}
