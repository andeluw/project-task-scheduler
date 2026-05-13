import { ButtonLink } from '@/components/button-link';
import { Typography } from '@/components/typography';

type SandboxLink = {
  name: string;
  path: string;
};

const sandboxLinks: SandboxLink[] = [
  {
    name: 'Button',
    path: '/sandbox/button',
  },
  {
    name: 'Colors',
    path: '/sandbox/colors',
  },
  {
    name: 'Typography',
    path: '/sandbox/typography',
  },
  {
    name: 'Form',
    path: '/sandbox/form',
  },
  {
    name: 'Loading',
    path: '/sandbox/loading',
  },
  {
    name: 'Table',
    path: '/sandbox/table',
  },
  {
    name: 'Card',
    path: '/sandbox/card',
  },
  {
    name: 'Scroll Area',
    path: '/sandbox/scroll-area',
  },
  {
    name: 'Dropdown',
    path: '/sandbox/dropdown',
  },
  {
    name: 'Dialog',
    path: '/sandbox/dialog',
  },
  {
    name: 'Modal',
    path: '/sandbox/modal',
  },
];

export default function Page() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <Typography variant='j2' className='mb-4'>
        Sandbox
      </Typography>
      <div className='flex gap-4 max-w-[90%] md:max-w-3/5 flex-wrap justify-center'>
        {sandboxLinks.map((link) => (
          <ButtonLink key={link.path} href={link.path} variant='light'>
            {link.name}
          </ButtonLink>
        ))}
      </div>
    </div>
  );
}
