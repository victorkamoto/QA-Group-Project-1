import * as React from "react";
import Link from "next/link";

import { type MainNavItem } from "../types";
import { cn } from "../lib/utils";
import { useLockBody } from "../hooks/use-lock-body";
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

interface MobileNavProps {
  items: MainNavItem[];
  children?: React.ReactNode;
}

export function MobileNav({ items, children }: MobileNavProps) {
  useLockBody();

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={"logo.svg"} alt="logo" width={50} height={50} />
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              {items.map((item, index) =>
                item.subItems ? (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
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
            </div>
          </NavigationMenuList>
        </NavigationMenu>
        {children}
      </div>
    </div>
  );
}
