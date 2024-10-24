"use client";

import { redirect } from "next/navigation";

import { DashboardHeader } from "../../../components/header";
import { DashboardShell } from "../../../components/shell";
import { UserNameForm } from "../../../components/user-name-form";
import { EmptyPlaceholder } from "../../../components/empty-placeholder";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { TeamDialog } from "../../../components/teams/create-join-team";
import TeamItem from "../../../components/teams/team-item";
import { store } from "../../../store/store";
import TeamItemDialog from "../../../components/teams/team-item.dialog";

export default async function TeamsPage() {
  const teams = store((state) => state.teams);
  const getTeams = store((state) => state.getTeams);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>();

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    getTeams();
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
        {teams ? (
          <div className="flex flex-wrap gap-4">
            {teams.map((team) => (
              <>
                <TeamItem
                  name={team.name}
                  description={team.description}
                  memberCount={8}
                  projectCount={12}
                  onClick={() =>
                    handleTeamClick({
                      ...team,
                      projects: [
                        { id: "1", name: "Website Redesign" },
                        { id: "2", name: "Mobile App UI" },
                        { id: "3", name: "Brand Guidelines" },
                      ],
                    })
                  }
                />
              </>
            ))}
            {selectedTeam && (
              <TeamItemDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                teamName={selectedTeam?.name}
                teamDescription={selectedTeam.description}
                projects={selectedTeam.projects}
                teamId={selectedTeam.xata_id}
              />
            )}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="empty" />
            <EmptyPlaceholder.Title>Nothing to see yet</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have anything here yet.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </>
    </DashboardShell>
  );
}
