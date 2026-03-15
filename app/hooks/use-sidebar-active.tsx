"use client";

import { usePathname } from "next/navigation";

export function useSidebarActive() {
  const pathname = usePathname();

  function isActiveUrl(url: string) {
    return pathname === url;
  }

  function isActiveSection(sectionRoot: string) {
    if (sectionRoot === "/") return pathname === "/";
    return pathname === sectionRoot || pathname.startsWith(`${sectionRoot}/`);
  }

  return {
    pathname,
    isActiveUrl,
    isActiveSection,
  };
}
