"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { type MainNavItem } from "../types";
import { cn } from "../lib/utils";
import { Icons } from "./icons";
import { MobileNav } from "./mobile-nav";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { ListItem } from "./ui/nav-list-item";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <div className="flex grow gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Image src={"logo.svg"} alt="logo" width={50} height={50} />
        <span className="text-xl">Task Manager</span>
      </Link>
      {items?.length ? (
        <nav className="hidden w-3/4 gap-6 md:flex">
          <div className="flex w-full flex-col items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {items?.map((item, index) =>
                  item.subItems ? (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuTrigger>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[300px]">
                          {item.subItems.map((subItem, index) => (
                            <ListItem
                              href={subItem.href}
                              title={subItem.title}
                              key={index}
                            >
                              {subItem.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={index}>
                      <Link href={item.href!} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ),
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {!showMobileMenu && <Icons.hamburger />}
        {showMobileMenu ? (
          <Icons.close />
        ) : (
          <Image
            src=""
            alt="Task Manager"
            width={0}
            height={0}
            className="h-auto w-[100px]"
          />
        )}
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
    </div>
  );
}
