import { LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router'

import Logo from '@/assets/logo.png'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <TooltipProvider>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                tooltip="返回首页"
                className="gap-2.5"
              >
                <Link to="/" aria-label="Tuff UI 首页">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background shadow-xs ring-1 ring-sidebar-border">
                    <img className="size-6 object-contain" src={Logo} alt="" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-semibold tracking-tight">
                      Tuff UI
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      应用工作台
                    </span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </TooltipProvider>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LayoutDashboard />
                  工作台
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
