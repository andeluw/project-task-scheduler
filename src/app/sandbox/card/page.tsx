'use client';

import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Typography } from '@/components/typography';

import SandboxLayout from '@/app/sandbox/containers/SandboxLayout';

export default function CardSandboxPage() {
  return (
    <SandboxLayout title='Card'>
      <div className='space-y-10'>
        <section className='space-y-3'>
          <Typography as='h2' variant='h2' weight='medium'>
            Basic Card
          </Typography>

          <Card>
            <CardHeader>
              <CardTitle>Basic Card</CardTitle>
              <CardDescription>
                A simple card with a title, description, and body text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Typography variant='b2'>
                This is a basic card. Use it as a generic container for text,
                form elements, or any other content.
              </Typography>
            </CardContent>
          </Card>
        </section>

        {/* Card with actions */}
        <section className='space-y-3'>
          <Typography as='h2' variant='h2' weight='medium'>
            Card with Footer Actions
          </Typography>

          <Card>
            <CardHeader>
              <CardTitle>Review Changes</CardTitle>
              <CardDescription>
                Use the footer for primary and secondary actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Typography variant='b2'>
                This area can contain a short summary, confirmation message, or
                any content that relates to the actions below.
              </Typography>
            </CardContent>
            <CardFooter className='justify-end gap-2'>
              <Button variant='outline'>Cancel</Button>
              <Button>Confirm</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Card with grid layout */}
        <section className='space-y-3'>
          <Typography as='h2' variant='h2' weight='medium'>
            Card with Grid Layout
          </Typography>

          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>
                Example of using a grid inside <code>CardContent</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
              <div className='flex flex-col gap-1'>
                <Typography variant='s3'>Name</Typography>
                <Typography variant='b2' className='text-muted-foreground'>
                  Jane Doe
                </Typography>
              </div>
              <div className='flex flex-col gap-1'>
                <Typography variant='s3'>Role</Typography>
                <Typography variant='b2' className='text-muted-foreground'>
                  Product Designer
                </Typography>
              </div>
              <div className='flex flex-col gap-1'>
                <Typography variant='s3'>Email</Typography>
                <Typography variant='b2' className='text-muted-foreground'>
                  jane.doe@example.com
                </Typography>
              </div>
              <div className='flex flex-col gap-1'>
                <Typography variant='s3'>Location</Typography>
                <Typography variant='b2' className='text-muted-foreground'>
                  Remote (GMT+7)
                </Typography>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </SandboxLayout>
  );
}
