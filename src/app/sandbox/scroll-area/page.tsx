'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { ScrollArea } from '@/components/scroll-area';
import { Typography } from '@/components/typography';

import SandboxLayout from '@/app/sandbox/containers/SandboxLayout';

export default function ScrollAreaSandboxPage() {
  return (
    <SandboxLayout title='Scroll Area'>
      <div className='space-y-10'>
        {/* Basic vertical scroll area */}
        <section className='space-y-3'>
          <Typography as='h2' variant='h2' weight='medium'>
            Basic Scroll Area
          </Typography>
          <Typography variant='b2' className='text-muted-foreground'>
            The content below is taller than the container, so it becomes
            scrollable. Use this pattern for panels, sidebars, or any area that
            needs its own scroll.
          </Typography>

          <ScrollArea className='h-56 w-full rounded-xl border bg-card'>
            <div className='p-4 space-y-2'>
              {Array.from({ length: 20 }).map((_, index) => (
                <Typography key={index} variant='b2'>
                  Item {index + 1} · This is an example line of content inside
                  the scroll area.
                </Typography>
              ))}
            </div>
          </ScrollArea>
        </section>

        {/* Scroll area inside a card */}
        <section className='space-y-3'>
          <Typography as='h2' variant='h2' weight='medium'>
            Scroll Area in a Card
          </Typography>
          <Typography variant='b2' className='text-muted-foreground'>
            You can also place a scroll area inside a card if you want the
            header and footer to stay fixed while only the body scrolls.
          </Typography>

          <Card className='max-w-xl'>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
              <ScrollArea className='h-40 rounded-lg border bg-background'>
                <div className='p-4 space-y-3'>
                  {Array.from({ length: 15 }).map((_, index) => (
                    <div key={index} className='space-y-1'>
                      <Typography variant='s3'>
                        Notification {index + 1}
                      </Typography>
                      <Typography
                        variant='b3'
                        className='text-muted-foreground'
                      >
                        This is a short message describing the notification
                        content. It is here only to show how the scroll behaves
                        with multiple items.
                      </Typography>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
      </div>
    </SandboxLayout>
  );
}
