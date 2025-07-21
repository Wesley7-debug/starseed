'use client';

import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function HandleLogout() {
  return (
    <span className=' cursor-pointer bg-blue-900 flex gap-1 justify-center items-center'
   
      onClick={() => signOut({ callbackUrl: '/Login' })}
    >
     <LogOutIcon /> Logout
    </span>
  );
}
