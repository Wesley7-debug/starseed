import { SidebarProvider } from "@/components/ui/sidebar"

export default function SidebarNav ({children}: {children: React.ReactNode}) {
    return(
        <SidebarProvider>
            <div>
              {children}
            </div>
      
        </SidebarProvider>
    )
}