/* eslint-disable no-console */
'use client';

import * as React from 'react';

import { useDialog } from '@/hooks/useDialog';

import { Button } from '@/components/button';
import { Typography } from '@/components/typography';

import SandboxLayout from '@/app/sandbox/containers/SandboxLayout';

export default function DialogSandboxPage() {
  const dialog = useDialog();

  const openInfo = () => {
    console.log('openInfo');
    dialog({
      title: 'Information',
      description:
        'This is an informational dialog. You can show any message here.',
      submitText: 'Got it',
      variant: 'info',
      withIcon: false,
      catchOnCancel: true,
    })
      .then(() => console.log('accepted info'))
      .catch(() => console.log('dismissed info'));
  };

  const openSuccess = () => {
    dialog({
      title: 'Action successful',
      description: 'Your action was completed successfully.',
      submitText: 'Nice',
      variant: 'success',
      withIcon: false,
      catchOnCancel: true,
    })
      .then(() => console.log('accepted success'))
      .catch(() => console.log('dismissed success'));
  };

  const openWarning = () => {
    dialog({
      title: 'Are you sure?',
      description:
        'This action may have side effects. Please review before continuing.',
      submitText: 'Continue',
      variant: 'warning',
      withIcon: true,
      catchOnCancel: true,
    })
      .then(() => console.log('accepted warning'))
      .catch(() => console.log('dismissed warning'));
  };

  const openDanger = () => {
    dialog({
      title: 'Dangerous action',
      description:
        'This action cannot be undone. Do you really want to proceed?',
      submitText: 'Delete anyway',
      variant: 'danger',
      withIcon: false,
      catchOnCancel: true,
    })
      .then(() => console.log('accepted danger'))
      .catch(() => console.log('dismissed danger'));
  };

  return (
    <SandboxLayout title='Dialog'>
      <div className='space-y-4'>
        <Typography as='h1' variant='h3' weight='medium'>
          Dialog Sandbox
        </Typography>
        <Typography variant='b2' className='text-muted-foreground'>
          Click the buttons below to open different dialog variants. Each dialog
          returns a promise so you can handle accept and cancel actions.
        </Typography>

        <div className='flex flex-wrap gap-3 mt-4'>
          <Button onClick={openInfo}>Open Info Dialog</Button>
          <Button onClick={openSuccess}>Open Success Dialog</Button>
          <Button onClick={openWarning}>Open Warning Dialog</Button>
          <Button onClick={openDanger}>Open Danger Dialog</Button>
        </div>
      </div>
    </SandboxLayout>
  );
}
