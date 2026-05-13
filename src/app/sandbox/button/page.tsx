'use client';

import {
  ArrowRight,
  CreditCard,
  HelpCircle,
  Laptop,
  Minus,
  Phone,
  Plus,
  Shield,
  X,
} from 'lucide-react';
import React from 'react';

import { ArrowLink } from '@/components/arrow-link';
import { Button, ButtonVariant } from '@/components/button';
import { ButtonLink } from '@/components/button-link';
import { IconButton } from '@/components/icon-button';
import { PrimaryLink } from '@/components/primary-link';
import { TextButton } from '@/components/text-button';
import { Typography } from '@/components/typography';
import { UnderlineLink } from '@/components/underline-link';
import { UnstyledLink } from '@/components/unstyled-link';

import SandboxLayout from '@/app/sandbox/containers/SandboxLayout';

const variantKeys = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'light',
  'dark',
  'destructive',
  'outlineblack',
] as ButtonVariant[];

export default function ButtonSandboxPage() {
  const renderButtonRow = (
    props?: Partial<React.ComponentProps<typeof Button>>,
  ) => (
    <div className='flex flex-wrap gap-2'>
      {variantKeys.map((variant: ButtonVariant) => (
        <Button key={variant} variant={variant} {...props}>
          {variant!.charAt(0).toUpperCase() + variant?.slice(1)}
        </Button>
      ))}
    </div>
  );

  const renderIconButtons = (
    props?: Partial<React.ComponentProps<typeof Button>>,
  ) => (
    <div className='flex flex-wrap gap-2'>
      {variantKeys.map((variant) => (
        <Button
          key={variant}
          variant={variant}
          leftIcon={Plus}
          rightIcon={ArrowRight}
          {...props}
        >
          Icon
        </Button>
      ))}
    </div>
  );

  return (
    <SandboxLayout title='Button Sandbox'>
      <section className='space-y-8'>
        <div className='space-y-6'>
          <Typography variant='j2'>Button</Typography>
          {renderButtonRow()}
          {renderIconButtons()}
          {renderButtonRow({ size: 'sm' })}
          {renderIconButtons({ size: 'sm' })}
          {renderButtonRow({ size: 'md' })}
          {renderIconButtons({ size: 'md' })}
          {renderButtonRow({ size: 'lg' })}
          {renderIconButtons({ size: 'lg' })}
          {renderButtonRow({ disabled: true })}
          {renderButtonRow({ isLoading: true })}
        </div>

        <div className='space-y-2'>
          <Typography variant='j2'>ButtonLink</Typography>
          <div className='flex flex-wrap gap-2'>
            {variantKeys.map((variant) => (
              <ButtonLink
                key={variant}
                variant={variant}
                href='https://google.com'
              >
                {variant!.charAt(0).toUpperCase() + variant!.slice(1)}
              </ButtonLink>
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          <Typography variant='j2'>PrimaryLink</Typography>
          <div className='flex flex-wrap gap-4'>
            <PrimaryLink href='/'>Internal Links</PrimaryLink>
            <PrimaryLink href='https://google.com'>Outside Links</PrimaryLink>
          </div>
        </div>

        <div className='space-y-2'>
          <Typography variant='j2'>UnstyledLink</Typography>
          <div className='flex flex-wrap gap-4'>
            <UnstyledLink href='/'>Internal Links</UnstyledLink>
            <UnstyledLink href='https://google.com'>Outside Links</UnstyledLink>
          </div>
        </div>

        <div className='space-y-2'>
          <Typography variant='j2'>UnderlineLink</Typography>
          <div className='flex flex-wrap gap-4'>
            <UnderlineLink href='/'>Internal Links</UnderlineLink>
            <UnderlineLink href='https://google.com'>
              Outside Links
            </UnderlineLink>
          </div>
        </div>

        <div className='space-y-2'>
          <Typography variant='j2'>ArrowLink</Typography>
          <div className='flex items-center flex-wrap gap-4'>
            <ArrowLink href='/' direction='left'>
              Direction Left
            </ArrowLink>
            <ArrowLink href='/'>Direction Right</ArrowLink>
            <ArrowLink
              as={UnstyledLink}
              className='inline-flex items-center'
              href='/'
            >
              Polymorphic
            </ArrowLink>
            <ArrowLink
              as={ButtonLink}
              variant='light'
              className='inline-flex items-center'
              href='/'
            >
              Polymorphic
            </ArrowLink>
          </div>
        </div>

        <div className='space-y-2'>
          <Typography variant='j2'>TextButton</Typography>
          <div className='flex flex-wrap gap-2'>
            <TextButton>Primary</TextButton>
            <TextButton variant='basic'>Basic</TextButton>
          </div>
        </div>

        <div className='space-y-2'>
          <Typography variant='j2'>IconButton</Typography>
          <div className='flex flex-wrap gap-2'>
            <IconButton icon={Plus} />
            <IconButton variant='secondary' icon={Minus} />
            <IconButton variant='outline' icon={Laptop} />
            <IconButton variant='ghost' icon={Phone} />
            <IconButton variant='dark' icon={Shield} />
            <IconButton variant='light' icon={CreditCard} />
            <IconButton variant='destructive' icon={X} />
            <IconButton variant='outlineblack' icon={HelpCircle} />
          </div>
        </div>
      </section>
    </SandboxLayout>
  );
}
