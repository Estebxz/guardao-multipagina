import type { ComponentType } from "react";

export type IconName =
  | "arrow-left"
  | "arrow-right"
  | "grid"
  | "github"
  | "escape"
  | "linkedin"
  | "panel-left"
  | "panel-right"
  | "plus"
  | "spinner"
  | "archive-box"
  | "trash"
  | "donut"
  | "arrow-up-left"
  | "arrow-prev-small"
  | "folders"
  | "settings"
  | "merge";

export type SidebarIcon = IconName | ComponentType<{ className?: string }>;

export type SidebarCollapsibleGroupItem = {
  label: string;
  tooltip: string;
  icon: SidebarIcon;
  url: string;
  isActive: boolean;
};
