import { notFound } from "next/navigation";

import { dashboardConfig } from "../../../config/dashboard";
import { MainNav } from "../../../components/main-nav";
import { DashboardNav } from "../../../components/nav";
import { DashFooter } from "../../../components/dash-footer";
import { UserAccountNav } from "../../../components/user-account-nav";
import React from "react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // const user = await getCurrentUser();

  // if (!user) {
  //   return notFound();
  // }

  let user = {
    name: "",
    avatar: "",
    email: "",
  };

  return (
    <div className="flex min-h-screen flex-col space-y-6 px-8 py-4">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4 px-8">
          <MainNav items={dashboardConfig.mainNav} />
          <UserAccountNav
            user={{
              name: user.name,
              avatar: user.avatar,
              email: user.email,
            }}
          />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] px-4">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <DashFooter className="border-t" />
    </div>
  );
}
