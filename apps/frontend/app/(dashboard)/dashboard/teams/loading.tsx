import React from "react";
import { CardSkeleton } from "../../../../components/card-skeleton";
import { DashboardHeader } from "../../../../components/header";
import { DashboardShell } from "../../../../components/shell";
import { Card } from "../../../../components/ui/card";

export default function DashboardTeamsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Teams" text="Manage teams" />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  );
}
