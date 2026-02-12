"use client";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "./aside";
import { cn } from "@/app/lib/utils";
import Image from "next/image";
import { PanelRightIcon } from "@ico/panel-right";
import { TooltipProvider } from "./tooltip";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { GridIcon } from "@ico/grid";
import { PlusIcon } from "../icons/plus";
import { NavLink } from "./nav-link";

function MinimalSidebar() {
  
  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        className="relative flex h-full flex-col border-border border-r text-foreground transition-all duration-300 ease-in-out bg-sidebar"
      >
        <SidebarHeader className="flex w-full flex-row justify-between group-data-[collapsible=icon]:flex-col">
          <div className="flex items-center gap-2">
            <Link
              href={"/"}
              className={cn(
                "flex items-center gap-2",
                "group-data-[collapsible=icon]:flex-col",
              )}
              aria-label="Texto Logotipo"
            >
              <div className="flex items-center justify-center rounded-lg p-2 transition-colors duration-150">
                <Image
                  src={"/favicon.svg"}
                  alt="Logo mark"
                  width={40}
                  height={40}
                />
              </div>
              <span className="group-data-[collapsible=icon]:hidden text-foreground font-fusion text-2xl">
                GUARDAO
              </span>
            </Link>
          </div>
          <SidebarMenuButton
            tooltip="Abrir panel"
            className="flex h-8 w-8 items-center justify-center"
            asChild
          >
            <SidebarTrigger>
              <PanelRightIcon className="size-6" />
            </SidebarTrigger>
          </SidebarMenuButton>
        </SidebarHeader>
        {/*navegacion*/}
        <SidebarGroup className="flex-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="flex w-full items-center gap-2 text-muted-foreground group-data-[collapsible=icon]:justify-center"
                tooltip="Dashboard"
                asChild
              >
                  <NavLink href="/dashboard" className="text-white hover:bg-accent">
                  <GridIcon className="size-8 shrink-0"/>
                  <span className="truncate group-data-[collapsible=icon]:hidden">Dashboard</span>
                  </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/**/}
            <SidebarMenuItem>
              <SidebarMenuButton
                className="flex w-full items-center gap-2 text-muted-foreground group-data-[collapsible=icon]:justify-center"
                tooltip="Documentos"
                asChild
              >
                <NavLink href="/doc" className="text-white hover:bg-accent">
                  <PlusIcon className="size-8 shrink-0"/>
                  <span className="truncate group-data-[collapsible=icon]:hidden">Documentos</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

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
                      Sign In
                    </span>
                  </SidebarMenuButton>
                </SignInButton>
              </SignedOut>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </Sidebar>
    </TooltipProvider>
  );
}

export default MinimalSidebar;
