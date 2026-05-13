'use client';

import {
  QueryClient,
  QueryClientProvider,
  QueryOptions,
} from '@tanstack/react-query';
import * as React from 'react';
import { Toaster } from 'react-hot-toast';

import api from '@/lib/api';

import { BaseDialog } from '@/components/base-dialog';
import Loading from '@/components/loading';
import { ThemeProvider } from '@/components/theme-provider';

import useDialogStore from '@/store/useDialogStore';

interface ProvidersProps {
  children: React.ReactNode;
}

const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
  const { data } = await api.get(`${queryKey?.[0]}`);
  return data;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

export default function Providers({ children }: ProvidersProps) {
  //#region  //*=========== Store ===========
  const open = useDialogStore.useOpen();
  const state = useDialogStore.useState();
  const handleClose = useDialogStore.useHandleClose();
  const handleSubmit = useDialogStore.useHandleSubmit();
  //#endregion  //*======== Store ===========
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <Toaster position='top-center' />
        <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
        <BaseDialog
          open={open}
          options={state}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
