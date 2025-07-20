'use client';

import { signOut } from 'next-auth/react';

export default function HandleLogout() {
  return (
    <span
      style={{ cursor: 'pointer', color: 'blue' }}
      onClick={() => signOut({ callbackUrl: '/Login' })}
    >
      Logout
    </span>
  );
}
