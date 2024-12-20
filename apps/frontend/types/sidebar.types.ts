export interface NavItemProps {
  href: string;
  icon?: any;
  title: string;
  shortcut?: string;
  collapsed: boolean;
  isUpdateButton?: boolean;
}

export interface NavSectionProps {
  title: string;
  items: NavItemProps[];
  collapsed: boolean;
}
