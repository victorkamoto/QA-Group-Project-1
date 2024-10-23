"use client";

import { redirect } from "next/navigation";

import { DashboardHeader } from "../../../components/header";
import { DashboardShell } from "../../../components/shell";
import { UserNameForm } from "../../../components/user-name-form";
import { EmptyPlaceholder } from "../../../components/empty-placeholder";
import React from "react";

export default async function SettingsPage() {
  const user = JSON.parse(localStorage.getItem("auth") || "");

  // if (!user) {
  //   redirect("/auth/login");
  // }
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <>
        <EmptyPlaceholder>
          {/* <EmptyPlaceholder.Icon name="empty" /> */}
          <EmptyPlaceholder.Title>Nothing to see yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have anything here yet.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      </>
    </DashboardShell>
  );
}
