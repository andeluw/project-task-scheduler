'use client';

import * as React from 'react';

import { Button } from '@/components/button';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalSection,
  ModalTitle,
} from '@/components/modal';
import { Typography } from '@/components/typography';

type ModalReturnType = {
  openModal: () => void;
};

export default function InfoModal({
  children,
}: {
  children: (props: ModalReturnType) => React.JSX.Element;
}) {
  const [open, setOpen] = React.useState(false);

  const modalReturn: ModalReturnType = {
    openModal: () => setOpen(true),
  };

  return (
    <>
      {children(modalReturn)}

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Information</ModalTitle>
            <ModalDescription className='text-typo-secondary'>
              This modal is used to display a simple message or additional
              information without any form elements.
            </ModalDescription>
          </ModalHeader>

          <ModalSection>
            <Typography variant='l'>
              You can use this pattern for confirmation messages, short
              explanations, or feature highlights. The body can be a single
              paragraph or a longer block of text, depending on your needs.
            </Typography>
          </ModalSection>

          <ModalFooter>
            <Button className='w-full' onClick={() => setOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
