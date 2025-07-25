"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {SidebarTrigger} from "@/components/ui/sidebar"

import { useSession } from "next-auth/react"
import Link from "next/link"
import HandleLogout from "@/components/reusable/Handle-logout"
export default function AdminHeader() {
  const {data: session} = useSession()
  return (
<header className='  relative top-0 '>
  <div className='  flex justify-between  p-4 '>
    {/* sidebarnav */}
  <SidebarTrigger/>

<DropdownMenu>
  <DropdownMenuTrigger>
<Avatar>
  {/* <AvatarImage src={session?.avatarUrl} /> */}
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback> {session?.user?.name?.charAt(0).toUpperCase() ?? "CN"}</AvatarFallback>
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


</header>
  );
}
