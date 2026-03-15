import type { IconName, SidebarIcon } from "@type/ui";

interface IconProps {
  name: IconName | SidebarIcon;
  className?: string;
}

export const UseIcon = ({ name, className = "" }: IconProps) => {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`/icons.svg#icon-${name}`} />
    </svg>
  );
};
