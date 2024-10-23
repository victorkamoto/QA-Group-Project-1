import React from "react";

import { EmptyPlaceholder } from "../../components/empty-placeholder";
import { DashboardHeader } from "../../components/header";
import { DashboardShell } from "../../components/shell";

export default async function DashboardPage() {
  return (
    <DashboardShell>
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
