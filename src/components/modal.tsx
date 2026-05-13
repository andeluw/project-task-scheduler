import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { IconButton } from '@/components/icon-button';
import { Typography } from '@/components/typography';

const Modal = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn([
      'fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-gray-700/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 p-10',
      className,
    ])}
    ref={ref}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    dismissible?: boolean;
  }
>(({ className, children, dismissible = true, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay>
      <DialogPrimitive.Content
        className={cn([
          'relative',
          'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'bg-white w-11/12 sm:max-w-xl border shadow-xl rounded-2xl',
          'flex flex-col gap-4 sm:gap-6 p-4 sm:p-6',
          className,
        ])}
        onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
        onPointerDownOutside={(e) => !dismissible && e.preventDefault()}
        ref={ref}
        {...props}
      >
        {children}

        {dismissible ? (
          <DialogPrimitive.Close
            asChild
            className={cn('absolute right-4 top-4', className)}
          >
            <IconButton
              icon={X}
              classNames={{ icon: 'text-2xl text-typo-icons' }}
              size='sm'
              variant='ghost'
            />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
      <div id='datepicker-portal' />
    </ModalOverlay>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col', className)} {...props}>
    <div className='space-y-1.5'>{props.children}</div>
  </div>
);
ModalHeader.displayName = 'ModalHeader';

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'bg-gray-50 rounded-b-2xl',
      '-mb-4 sm:-mb-6 -mx-4 sm:-mx-6',
      'px-4 sm:px-6 py-4 sm:py-6',
      'flex flex-col-reverse sm:flex-row sm:justify-end',
      'gap-y-2 sm:gap-x-2 ',
      className,
    )}
    {...props}
  />
);
ModalFooter.displayName = 'ModalFooter';

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>((props, ref) => (
  <DialogPrimitive.Title asChild className='text-balance' ref={ref} {...props}>
    <Typography as={DialogPrimitive.Title} variant='h2'>
      {props.children}
    </Typography>
  </DialogPrimitive.Title>
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>((props, ref) => (
  <DialogPrimitive.Description asChild ref={ref} {...props}>
    <Typography
      as={DialogPrimitive.Description}
      className='text-pretty'
      variant='b3'
    >
      {props.children}
    </Typography>
  </DialogPrimitive.Description>
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

const ModalSection = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col', className)} {...props} />
);
ModalSection.displayName = 'ModalSection';

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPortal,
  ModalSection,
  ModalTitle,
  ModalTrigger,
};
