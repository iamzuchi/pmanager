"use client"
import { ProjectProps, WorkspaceMembersProps } from "@/lib/types"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { CreateProjectForm } from "../project/create-project-form";
import { $Enums } from "@prisma/client";
import { getPhaseColor } from "@/lib/utils";
import { phaseLabels } from "@/lib/constants";
import { projectPhaseStats } from "@/utils";
import { Badge } from "../ui/badge";

 

export const NavProjects = ({projects, workspaceMembers}:{
    projects: ProjectProps[];
    workspaceMembers: WorkspaceMembersProps[]
}) => {
    const {isMobile, setOpenMobile} = useSidebar()
    const  pathname = usePathname()
    return <>

    <SidebarGroup className="group-data-[collapsible-icon]:hidden">
        <SidebarGroupLabel className="flex justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase">
                Projects
            </span>

            <CreateProjectForm workspaceMembers={workspaceMembers}/>
        </SidebarGroupLabel>

        <SidebarMenu>
  {projects?.map((proj) => {
    const href = `/workspace/${proj.workspaceId}/projects/${proj.id}`;
    const phase = (proj.phase as $Enums.ProjectPhase); 
    const isActive = pathname === href;

    const phaseStat = projectPhaseStats.find((p)=> p.phase === phase);
    


    return (
      <SidebarMenuItem key={proj?.id}>
        <SidebarMenuButton>
          <a
            href={href}
            className={`flex items-center gap-2 ${
              isActive
                ? "text-blue-500 font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`flex items-center justify-center rounded-md border text-[10px] px-2 py-0.5 font-medium text-white`}
            >
              <Badge variant={phase as any}>
              {phase === "ON_HOLD" ? "HOLD" : phase}
              </Badge>
            </span>
            {proj?.name}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  })}
</SidebarMenu>
    </SidebarGroup>
    </>
}