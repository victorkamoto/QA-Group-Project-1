"use client";

import Link from "next/link";
import { MainNav } from "../../components/main-nav";
import { UserAccountNav } from "../../components/user-account-nav";
import { navConfig } from "../../config/nav";
import { Button } from "../../components/ui/button";
import { SiteFooter } from "../../components/site-footer";
import { useAuth } from "../../components/auth/auth-provider";

interface CoreLayoutProps {
  children: React.ReactNode;
}

export default function CoreLayout({ children }: CoreLayoutProps) {
  const { user } = useAuth();
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 bg-background md:px-16 md:py-4">
          <div className="container flex h-16 items-center justify-between py-4">
            <MainNav items={navConfig.mainNav} />
            {user && (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant={"outline"}>
                    <span>Go to dashboard</span>
                  </Button>
                </Link>
                <UserAccountNav
                  user={{
                    name: user?.name,
                    email: user?.email,
                  }}
                />
              </div>
            )}
            {!user && (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant={"outline"}>
                    <span>Log in</span>
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant={"default"}>
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </header>
        <main className="container flex-1 px-0">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
