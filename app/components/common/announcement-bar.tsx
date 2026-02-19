"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@common/button";
import { XIcon } from "@ico/escape";
import { HIDE_ANNOUNCEMENT_BAR_STORAGE_KEY } from "@lib/local-cookies";

export function AnnouncementBar() {
  const showAnnouncement = useSyncExternalStore(
    () => {
      return () => {};
    },
    () => {
      try {
        const hidden = window.localStorage.getItem(
          HIDE_ANNOUNCEMENT_BAR_STORAGE_KEY,
        );
        return hidden !== "true";
      } catch {
        return true;
      }
    },
    () => true,
  );

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(HIDE_ANNOUNCEMENT_BAR_STORAGE_KEY, "true");
    } catch {
      console.error("No se pudo guardar la preferencia de ocultar el anuncio");
    }
  };

  if (!showAnnouncement) return null;

  return (
    <div className="flex h-10 items-center justify-center border-b border-border bg-muted px-4 text-foreground">
      <div className="flex items-center gap-2 text-center text-xs sm:text-sm">
        <span className="text-muted-foreground">
          Este proyecto se encuentra en desarrollo y <strong className="text-yellow-600">aún no está terminado.</strong>
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="p-0! size-6 rounded-full text-xs opacity-60 transition-all hover:bg-primary/10 hover:opacity-100"
          aria-label="Cerrar anuncio"
        >
          <XIcon className="size-3" />
        </Button>
      </div>
    </div>
  );
}
