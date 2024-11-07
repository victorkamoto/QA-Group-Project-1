"use client";

import { redirect } from "next/navigation";

import { DashboardHeader } from "../../../../components/header";
import { DashboardShell } from "../../../../components/shell";
import { UserNameForm } from "../../../../components/user-name-form";
import { EmptyPlaceholder } from "../../../../components/empty-placeholder";
import React, { useEffect, useState } from "react";
import { ProjectDialog } from "../../../../components/projects/create-project";
import { store } from "../../../../store/store";
import ProjectItem from "../../../../components/projects/project-item";
import ProjectItemDialog from "../../../../components/projects/project-item.dialog";

export default async function ProjectsPage() {
  const projects = store((state) => state.projects);
  const getProjects = store((state) => state.getProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>();

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };
  // if (!user) {
  //   redirect("/auth/login");
  // }
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="Manage projects">
        <ProjectDialog buttonText="Create Project" />
      </DashboardHeader>

      <>
        {projects ? (
          <div className="flex flex-wrap gap-4">
            {projects.map((project) => (
              <>
                <ProjectItem
                  name={project.name}
                  team={{ name: "Shujaaz" }}
                  taskCount={12}
                  onClick={() =>
                    handleProjectClick({
                      ...project,
                      tasks: [
                        { xata_id: "1", description: "Website Redesign" },
                        { xata_id: "2", description: "Mobile App UI" },
                        { xata_id: "3", description: "Brand Guidelines" },
                      ],
                    })
                  }
                />
              </>
            ))}
            {selectedProject && (
              <ProjectItemDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                projectName={selectedProject?.name}
                team={{ xata_id: "tadada", name: "Shujaa" }}
                tasks={selectedProject.tasks}
                projectId={selectedProject.xata_id}
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
