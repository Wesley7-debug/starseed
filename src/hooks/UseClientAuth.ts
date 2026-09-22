'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export function useClientAuth() {
  const { data: session, status } = useSession();
  const redirected = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session && !redirected.current) {
      redirected.current = true;
      window.location.href = '/Login';
    }
  }, [session, status]);

  return { session, status };
}
