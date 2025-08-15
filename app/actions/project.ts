"use server";

import { ProjectDataType } from "@/components/project/create-project-form";
import { userRequired } from "../data/user/is-user-authenticated";
import { db } from "@/lib/db";
import { projectSchema } from "@/lib/schema";

export const createNewProject = async (data: ProjectDataType) => {
  try {
    const { user } = await userRequired();

    const workspace = await db.workspace.findUnique({
      where: { id: data.workspaceId },
      include: {
        projects: { select: { id: true } },
      },
    });

    if (!workspace) {
      return { success: false, error: "Workspace not found" };
    }

    const validatedData = projectSchema.parse(data);

    const workspaceMembers = await db.workspaceMember.findMany({
      where: { workspaceId: data.workspaceId },
    });

    const isUserMember = workspaceMembers.some((member) => member.userId === user.id);

    if (!isUserMember) {
      return { success: false, error: "You are not authorized to create a project in this workspace" };
    }

    const memberAccessIds = validatedData.memberAccess?.length
      ? [...validatedData.memberAccess]
      : [];

    if (!memberAccessIds.includes(user.id)) {
      memberAccessIds.push(user.id);
    }

    const projectAccess = memberAccessIds
      .map((memberId) => {
        const workspaceMember = workspaceMembers.find((member) => member.userId === memberId);
        if (!workspaceMember) return null;
        return {
          workspaceMemberId: workspaceMember.id,
          hasAccess: true,
        };
      })
      .filter(Boolean) as { workspaceMemberId: string; hasAccess: boolean }[];

    await db.project.create({
      data: {  
        name: validatedData.name,
        description: validatedData.description || "",
        phase: validatedData.phase,
        workspaceId: validatedData.workspaceId,
        projectAccess: {
          create: projectAccess,
        },
        activities: {
          create: {
            type: "PROJECT__CREATED",
            description: `Project created: ${validatedData.name}`,
            userId: user.id,
          },
        },
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return {
      success: false,
      error: error.message || "Something went wrong while creating the project.",
    };
  }
};

export const postComment = async (
  workspaceId: string,
  projectId: string,
  content: string
) => {
  const { user } = await userRequired();

  const isMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this workspace");
  }

  const projectAccess = await db.projectAccess.findUnique({
    where: {
      workspaceMemberId_projectId: {
        workspaceMemberId: isMember.id,
        projectId,
      },
    },
  });

  if (!projectAccess) {
    throw new Error("You do not have access to this project");
  }

  const comment = await db.comment.create({
    data: {
      content,
      projectId,
      userId: user.id,
    },
  });

  return comment;
};
