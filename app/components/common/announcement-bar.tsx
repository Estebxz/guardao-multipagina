"use client";

import { useEffect, useState } from "react";
import { Button } from "@ui/button";
import { UseIcon } from "@hooks/use-icons";
import { HIDE_ANNOUNCEMENT_BAR_STORAGE_KEY } from "@lib/local-cookies";
import { toast } from "sonner";

export function AnnouncementBar() {
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    let nextShow = true;
    try {
      const hidden = window.localStorage.getItem(
        HIDE_ANNOUNCEMENT_BAR_STORAGE_KEY,
      );
      nextShow = hidden !== "true";
    } catch {
      nextShow = true;
    }

    const timeoutId = window.setTimeout(() => {
      setShowAnnouncement(nextShow);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(HIDE_ANNOUNCEMENT_BAR_STORAGE_KEY, "true");
      setShowAnnouncement(false);
    } catch {
      toast.error("Error", {
        description: "No se pudo guardar la preferencia de ocultar el anuncio",
      });
    }
  };

  if (!showAnnouncement) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-10 items-center justify-center border-b border-border bg-muted px-4 text-foreground">
      <div className="flex items-center gap-2 text-center text-xs sm:text-sm">
        <span className="text-muted-foreground">
          Este proyecto se encuentra en desarrollo y{" "}
          <strong className="text-yellow-600">aún no está terminado.</strong>
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          aria-label="Cerrar anuncio"
        >
          <UseIcon name="escape" className="size-3" />
        </Button>
      </div>
    </div>
  );
}
