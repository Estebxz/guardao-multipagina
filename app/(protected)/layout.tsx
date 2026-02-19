import type { Metadata } from "next";
import { getSecureUser } from "@lib/auth/server";
import { SidebarProvider } from "@common/aside";
import MinimalSidebar from "@common/integration-sidebar";
import { StatusBar } from "@common/status-bar";
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
      defaultOpen={false}
      className="grid h-dvh grid-rows-[auto_1fr]"
    >
      <div className="row-span-2 flex">
        <MinimalSidebar />

        <main className="relative flex flex-1 overflow-auto">
          <div className="flex h-full w-full flex-col">
            <div className="flex-1">{children}</div>
            <StatusBar userName={user.fullName} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
