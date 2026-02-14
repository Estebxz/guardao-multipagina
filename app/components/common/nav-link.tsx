"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@lib/utils";

export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-2 transition-colors",
        isActive && "bg-accent",
        className,
      )}
    >
      {children}
    </Link>
  );
}
