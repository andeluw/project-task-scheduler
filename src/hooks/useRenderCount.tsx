import * as React from 'react';

export function useRenderCount() {
  const count = React.useRef(1);
  React.useEffect(() => {
    count.current += 1;
  });
  return count.current;
}
