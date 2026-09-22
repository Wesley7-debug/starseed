'use client';

import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function HandleLogout() {
  return (
    <span
      className="flex cursor-pointer items-center gap-1.5"
      onClick={() => signOut({ callbackUrl: "/Login" })}
    >
      <LogOutIcon className="size-4" />
      
    </span>
  );
}
