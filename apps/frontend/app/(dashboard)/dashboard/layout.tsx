"use client";
import { notFound } from "next/navigation";

import { dashboardConfig } from "../../../config/dashboard";
import { MainNav } from "../../../components/main-nav";
import { DashboardNav } from "../../../components/nav";
import { DashFooter } from "../../../components/dash-footer";
import { UserAccountNav } from "../../../components/user-account-nav";
import React from "react";
import { useAuth } from "../../../components/auth/auth-provider";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col space-y-6 px-8 py-4">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4 px-8">
          <MainNav items={dashboardConfig.mainNav} />
          {user && (
            <UserAccountNav
              user={{
                name: user?.name,
                email: user?.email,
              }}
            />
          )}
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
