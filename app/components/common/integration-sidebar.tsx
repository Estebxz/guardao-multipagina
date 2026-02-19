"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "./aside";
import { cn } from "@lib/utils";
import Image from "next/image";
import { TooltipProvider } from "./tooltip";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { UseIcon } from "@hooks/use-icons";

function MinimalSidebar() {
  const pathname = usePathname();

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
            className="flex size-8 items-center hover:bg-accent/80 justify-center"
            asChild
          >
            <SidebarTrigger>
              <UseIcon name="panel-right" className="size-4" />
            </SidebarTrigger>
          </SidebarMenuButton>
        </SidebarHeader>
        {/*Navegacion principal | Dashboard*/}
        <SidebarContent className="flex-1 gap-0">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Navegar al inicio"
                  className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/dashboard"
                    data-active={pathname === "/dashboard"}
                    className="flex w-full items-center gap-2 text-muted-foreground group-data-[collapsible=icon]:justify-center"
                  >
                    <UseIcon name="grid" className="size-4 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      Inicio
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/*Nuevo documento*/}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Crear nuevo documento"
                  className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/doc"
                    data-active={pathname === "/doc"}
                    className="flex w-full items-center gap-2 text-muted-foreground group-data-[collapsible=icon]:justify-center"
                  >
                    <UseIcon name="plus" className="size-4 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      Nuevo documento
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Ver documentos */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Navegar a documentos"
                  className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent/80 hover:text-foreground group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/items"
                    data-active={pathname === "/doc"}
                    className="flex w-full items-center gap-2 text-muted-foreground group-data-[collapsible=icon]:justify-center"
                  >
                    <UseIcon name="archive-box" className="size-4 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      Ver documentos
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/*Navegacion secundaria | Signout*/}
          <SidebarGroup className="mt-auto pb-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SignedIn>
                  <SidebarMenuButton
                    className="p-0! group-data-[collapsible=icon]:p-0! flex w-full items-center justify-start gap-2 text-foreground text-sm transition-colors hover:bg-muted/50"
                    tooltip="User Profile"
                    asChild
                  >
                    <UserButton showName={true} />
                  </SidebarMenuButton>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <SidebarMenuButton
                      className={cn(
                        "flex h-10 w-full items-center justify-center gap-1.5 rounded-sm px-2 py-1 font-medium text-base transition-colors duration-150",
                        "active:bg-sidebar-accent/60! active:text-foreground! bg-sidebar-accent text-foreground hover:bg-sidebar-accent/80 hover:text-foreground",
                        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:text-[10px]",
                      )}
                    >
                      <span className="group-data-[collapsible=icon]:hidden">
                        Iniciar sesión
                      </span>
                    </SidebarMenuButton>
                  </SignInButton>
                </SignedOut>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}

export default MinimalSidebar;
