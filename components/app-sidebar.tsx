import * as React from "react"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, UsersIcon, ClockIcon, CommandIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <LayoutDashboardIcon />,
    isActive: true,
  },
  {
    title: "Prefects List",
    url: "/prefects",
    icon: <UsersIcon />,
  },
  {
    title: "Recent Entries",
    url: "/entries",
    icon: <ClockIcon />,
  },
]

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userData = user ? {
    name: user.email?.split('@')[0] || "User",
    email: user.email || "",
    avatar: user.user_metadata?.avatar_url || "/avatars/shadcn.jpg",
  } : {
    name: "Guest",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CommandIcon className="size-3" />
              </div>
              <span className="text-base font-semibold">Prefect Ledger</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
