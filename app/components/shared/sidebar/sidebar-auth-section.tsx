"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { cn } from "@lib/utils";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@ui/aside";

export function SidebarAuthSection({
  className,
}: {
  className?: string;
}) {
  return (
    <SidebarGroup className={cn("mt-auto pb-2", className)}>
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
  );
}
