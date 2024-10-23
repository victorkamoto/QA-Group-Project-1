"use client";

import { redirect } from "next/navigation";

import { DashboardHeader } from "../../../components/header";
import { DashboardShell } from "../../../components/shell";
import { UserNameForm } from "../../../components/user-name-form";
import { EmptyPlaceholder } from "../../../components/empty-placeholder";
import React, { useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { TeamDialog } from "../../../components/create-join-team";

export default async function TeamsPage() {
  let user = {};

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("auth") || "");
  }, []);

  // if (!user) {
  //   redirect("/auth/login");
  // }
  return (
    <DashboardShell>
      <DashboardHeader heading="Teams" text="Manage teams">
        <div className="flex justify-end space-x-4">
          <TeamDialog type="join" buttonText="Join Team" />
          <TeamDialog type="create" buttonText="Create Team" />
        </div>
      </DashboardHeader>
      <>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>Nothing to see yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have anything here yet.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      </>
    </DashboardShell>
  );
}
