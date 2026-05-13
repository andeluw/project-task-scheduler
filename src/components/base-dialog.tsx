import { AlertCircle, Check, Info, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import { IconButton } from '@/components/icon-button';

const colorVariant = {
  info: {
    text: {
      primary: 'text-primary-500',
    },
    icon: Info,
  },
  success: {
    text: {
      primary: 'text-green-500',
    },
    icon: Check,
  },
  warning: {
    text: {
      primary: 'text-yellow-500',
    },
    icon: AlertCircle,
  },
  danger: {
    text: {
      primary: 'text-red-500',
    },
    icon: AlertCircle,
  },
};

export type BaseDialogProps = {
  /** Maintained by useDialogStore */
  open: boolean;
  /** Maintained by useDialogStore */
  onSubmit: () => void;
  /** Maintained by useDialogStore */
  onClose: () => void;
  /** Customizable Dialog Options */
  options: DialogOptions;
};

export type DialogOptions = {
  title: React.ReactNode;
  description: React.ReactNode;
  variant: 'info' | 'success' | 'warning' | 'danger';
  isLoading: boolean;
  submitText: React.ReactNode;
  withIcon: boolean;
  catchOnCancel?: boolean;
  listenForLoadingToast?: boolean;
};

/**
 * Base Dialog for useDialog hook implementation.
 *
 * **Should be called with the hook, not by the component itself**
 *
 *
 * @see useDialogStore
 * @example
 * ```tsx
 * const dialog = useDialog();
 *
 * dialog(options);
 * ```
 */
const BaseDialog = ({
  open,
  onSubmit,
  onClose,
  options: {
    title,
    description,
    variant,
    submitText,
    isLoading,
    withIcon,
    listenForLoadingToast = false,
  },
}: BaseDialogProps) => {
  const current = colorVariant[variant];

  return (
    <AlertDialog onOpenChange={(isOpen) => !isOpen && onClose()} open={open}>
      <AlertDialogContent className='relative'>
        <div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
          <IconButton
            icon={X}
            classNames={{ icon: 'text-2xl text-typo-icons' }}
            onClick={onClose}
            size='sm'
            variant='ghostblack'
          />
        </div>

        <AlertDialogHeader className='flex flex-col gap-y-4'>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <div className='sm:flex sm:items-start sm:gap-x-4'>
            {withIcon ? (
              <current.icon
                aria-hidden='true'
                className={cn('size-4 mt-[3px]', current.text.primary)}
              />
            ) : null}
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            isLoading={listenForLoadingToast ? isLoading : undefined}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            isLoading={listenForLoadingToast ? isLoading : undefined}
            onClick={onSubmit}
            variant={
              variant === 'success' || variant === 'info' ? 'primary' : 'danger'
            }
          >
            {submitText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
BaseDialog.displayName = 'BaseDialog';

export { BaseDialog };
