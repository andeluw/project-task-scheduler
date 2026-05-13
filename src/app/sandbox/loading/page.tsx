import Loading from '@/components/loading';

import SandboxLayout from '@/app/sandbox/containers/SandboxLayout';

export default function LoadingSandbox() {
  return (
    <SandboxLayout title='Loading...'>
      <Loading />
    </SandboxLayout>
  );
}
