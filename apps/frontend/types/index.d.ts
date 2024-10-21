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
