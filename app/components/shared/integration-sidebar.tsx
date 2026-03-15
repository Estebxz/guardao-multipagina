"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarRail,
} from "@ui/aside";
import { TooltipProvider } from "@ui/tooltip";
import { cn } from "@lib/utils";
import { integrationsNav, mainNav, documentsNav } from "@lib/sidebar-nav";
import { SidebarNavItem } from "@shared/sidebar/sidebar-nav-item";
import { SidebarCollapsibleGroup } from "@shared/sidebar/sidebar-collapsible-group";
import { SidebarAuthSection } from "@shared/sidebar/sidebar-auth-section";
import { UseIcon } from "@hooks/use-icons";
import { useSidebarActive } from "@hooks/use-sidebar-active";
import type { SidebarCollapsibleGroupItem } from "@type/ui";

function MinimalSidebar() {
  const { isActiveSection, isActiveUrl } = useSidebarActive();

  const documentsItems: SidebarCollapsibleGroupItem[] = documentsNav.map(
    (item) => ({
      ...item,
      isActive: isActiveUrl(item.url),
    }),
  );

  const integrationsItems: SidebarCollapsibleGroupItem[] = integrationsNav.map(
    (item) => ({
      ...item,
      isActive: isActiveUrl(item.url),
    }),
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible="icon"
        className="relative flex h-full flex-col border-border border-r text-foreground transition-all duration-300 ease-in-out bg-sidebar"
      >
        <SidebarHeader className="flex w-full flex-row justify-between group-data-[collapsible=icon]:flex-col">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2",
                "group-data-[collapsible=icon]:flex-col",
              )}
              aria-label="Inicio"
            >
              <div className="flex items-center justify-center rounded-lg bg-foreground p-2 transition-colors duration-150 hover:bg-foreground/80">
                <Image
                  src="/favicon.svg"
                  alt="Logo mark"
                  width={30}
                  height={30}
                  className={cn(
                    "h-4 w-4",
                    "group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4",
                  )}
                />
              </div>
              <span className="group-data-[collapsible=icon]:hidden">
                <Image
                  src="/text-logo.svg"
                  alt="Logo mark"
                  width={90}
                  height={22}
                />
              </span>
            </Link>
          </div>
          <SidebarMenuButton
            tooltip="Abrir panel lateral"
            className="flex size-8 items-center hover:bg-accent/70 justify-center"
            asChild
          >
            <SidebarTrigger>
              <UseIcon name="panel-right" className="size-4" />
            </SidebarTrigger>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent className="flex-1 gap-0">
          <SidebarGroup>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarNavItem
                  key={item.url}
                  label={item.label}
                  tooltip={item.tooltip}
                  icon={item.icon}
                  url={item.url}
                  isActive={isActiveSection(item.url)}
                />
              ))}
              <SidebarCollapsibleGroup
                label="Documentos"
                tooltip="Navegar a documentos"
                icon="folders"
                isActive={isActiveSection("/documents")}
                items={documentsItems}
              />
              <SidebarCollapsibleGroup
                label="Integraciones"
                tooltip="Navegar a integraciones"
                icon="settings"
                isActive={isActiveSection("/integrations")}
                items={integrationsItems}
              />
            <div>
              <SidebarMenuButton
                asChild
                tooltip="Ver todas las integraciones"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-accent brightness-150 text-sm hover:bg-muted hover:text-accent/80 group-data-[collapsible=icon]:justify-center"
              >
                <Link href="/integrations">
                  <UseIcon name="merge" className="size-4 shrink-0 rotate-180" />
                  <span className="truncate group-data-[collapsible=icon]:hidden">
                    Ver todas las integraciones
                  </span>
                </Link>
              </SidebarMenuButton>
            </div>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarAuthSection />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}

export default MinimalSidebar;
