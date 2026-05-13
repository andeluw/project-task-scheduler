'use client';

import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import logger from '@/lib/logger';

import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { DatePicker } from '@/components/datepicker';
import { Input } from '@/components/input';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalSection,
  ModalTitle,
} from '@/components/modal';
import { Textarea } from '@/components/textarea';
import { Typography } from '@/components/typography';

type ModalReturnType = {
  openModal: () => void;
};

type FormValues = {
  name: string;
  email: string;
  preferredDate: Date;
  message: string;
  agree: boolean;
};

export default function FormModal({
  children,
}: {
  children: (props: ModalReturnType) => React.JSX.Element;
}) {
  const [open, setOpen] = React.useState(false);

  const methods = useForm<FormValues>();
  const { handleSubmit, reset } = methods;

  const modalReturn: ModalReturnType = {
    openModal: () => setOpen(true),
  };

  const onSubmit = (data: FormValues) => {
    logger(data);
    setOpen(false);
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <>
      {children(modalReturn)}

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>
                <ModalTitle>Contact Form</ModalTitle>
                <ModalDescription className='text-typo-secondary'>
                  This modal uses the shared form components and includes a
                  datepicker field.
                </ModalDescription>
              </ModalHeader>

              <ModalSection className='space-y-4 mt-4'>
                <Input
                  id='name'
                  label='Name'
                  placeholder='Enter your name'
                  validation={{ required: 'Name is required' }}
                />

                <Input
                  id='email'
                  type='email'
                  label='Email'
                  placeholder='Enter your email'
                  validation={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  }}
                />

                <DatePicker
                  name='preferredDate'
                  label='Preferred Date'
                  validation={{ required: 'Please select a date' }}
                />

                <Textarea
                  id='message'
                  label='Message'
                  placeholder='Write your message here...'
                  rows={4}
                  validation={{ required: 'Message is required' }}
                />

                <Checkbox
                  name='agree'
                  label='I agree to the terms and conditions'
                  value='agree'
                  size='base'
                  validation={{ required: 'You must agree before submitting' }}
                />

                <Typography variant='b3' className='text-muted-foreground'>
                  This form is only for demonstration. The submitted values are
                  logged in the console when you click Submit.
                </Typography>
              </ModalSection>

              <ModalFooter className='gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type='submit' className='w-full'>
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </FormProvider>
        </ModalContent>
      </Modal>
    </>
  );
}
