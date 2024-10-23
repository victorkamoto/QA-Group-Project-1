import { Icons } from "../components/icons";

export type User = {
  name: string;
  email: string;
  avatar: string;
};
export type NavItem = {
  title: string;
  href?: string;
  subItems?: SubNavItem[];
};

export type SubNavItem = {
  title: string;
  href?: string;
  description: string;
};

export type MainNavItem = NavItem;

export type NavConfig = {
  mainNav: MainNavItem[];
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);
