import { ThemeToggle } from '@/components/theme-toggle';
import { Typography } from '@/components/typography';
import { UnderlineLink } from '@/components/underline-link';

export default function SandboxLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className='mx-auto w-10/12 min-h-screen py-20'>
        <ThemeToggle />
        <Typography as='h1' variant='j2' className='mt-4'>
          {title}
        </Typography>

        <UnderlineLink href='/sandbox' className='mt-2 mb-8'>
          Back to Sandbox
        </UnderlineLink>
        {children}
      </div>
    </main>
  );
}
