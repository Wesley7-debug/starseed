"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {SidebarTrigger} from "@/components/ui/sidebar"

import * as React from "react"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import HandleLogout from "@/components/reusable/Handle-logout"
import Link from "next/link"
export default function TeacherHeader() {
 
  
  return (
<header className='  relative top-0 '>
  <div className='  flex justify-between  p-4 '>
    {/* sidebarnav */}
  <SidebarTrigger/>
<div className='flex items-center space-x-4'>

 

<DropdownMenu>
  <DropdownMenuTrigger>
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
     <DropdownMenuLabel>My Account</DropdownMenuLabel>
     <DropdownMenuSeparator/>
     <DropdownMenuItem>
       <span>
         <Link href='/ViewProfile'>
         View Profile
         </Link>
       </span>
       </DropdownMenuItem>
     <DropdownMenuItem><HandleLogout/></DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu>
</div>
  </div>

</header>
  );
}
