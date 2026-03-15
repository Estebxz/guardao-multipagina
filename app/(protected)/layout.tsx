import type { Metadata } from "next";
import { getSecureUser } from "@lib/auth/server";
import { SidebarProvider } from "@/app/components/ui/aside";
import MinimalSidebar from "@/app/components/shared/integration-sidebar";
import { StatusBar } from "@/app/components/layout/status-bar";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "GUARDAO",
  description: "Dashboard interactivo solo para usuarios registrados",
};

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSecureUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      className="grid h-dvh grid-rows-[auto_1fr]"
    >
      <div className="row-span-2 flex min-w-0">
        <MinimalSidebar />
        <main className="relative flex flex-1 min-w-0 overflow-hidden">
          <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-background text-foreground p-4 sm:p-6 lg:p-10">
              {children}
            </div>
            <div className="shrink-0">
              <StatusBar userName={user.fullName} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
