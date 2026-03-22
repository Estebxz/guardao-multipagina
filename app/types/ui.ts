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
  | "merge"
  | "code"
  | "clock"
  | "home";

export type SidebarIcon = IconName | ComponentType<{ className?: string }>;

export type SidebarCollapsibleGroupItem = {
  label: string;
  tooltip: string;
  icon: SidebarIcon;
  url: string;
  isActive: boolean;
};


export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
}

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: "public" | "private" | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}