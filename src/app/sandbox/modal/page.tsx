'use client';

import * as React from 'react';

import { Button } from '@/components/button';

import SandboxLayout from '@/app/sandbox/containers/SandboxLayout';
import FormModal from '@/app/sandbox/modal/components/FormModal';
import InfoModal from '@/app/sandbox/modal/components/InfoModal';

export default function ModalPage() {
  return (
    <SandboxLayout title='Modal Sandbox'>
      <div className='flex flex-wrap gap-3'>
        <InfoModal>
          {({ openModal }) => (
            <Button onClick={openModal}>Open Info Modal</Button>
          )}
        </InfoModal>

        <FormModal>
          {({ openModal }) => (
            <Button onClick={openModal}>Open Form Modal</Button>
          )}
        </FormModal>
      </div>
    </SandboxLayout>
  );
}
