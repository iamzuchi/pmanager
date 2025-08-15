import { db } from "@/lib/db";
import { userRequired } from "../user/is-user-authenticated";
import { AccessLevel, Prisma } from "@prisma/client";

export const getWorkspaceDashboardByWorkspaceId = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();

    const isUserMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (!isUserMember) {
      throw new Error(`User is not a member of the workspace.`);
    }

    // Build project query based on access level
    const projectQuery: Prisma.ProjectWhereInput =
      isUserMember.accessLevel === AccessLevel.OWNER
        ? { workspaceId }
        : {
            projectAccess: {
              some: {
                hasAccess: true,
                workspaceMember: { userId: user.id, workspaceId },
              },
            },
          };

    // Fetch projects and workspace members
    const [projects, workspaceMembers] = await Promise.all([
      db.project.findMany({
        where: projectQuery,
        select: {
          id: true,
          name: true,
          workspaceId: true,
          description: true,
        },
      }),
      db.workspaceMember.findMany({
        where: { workspaceId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              updatedAt: true,
            },
          },
        },
      }),
    ]);

    // Get all project IDs
    const projectIds = projects.map((project) => project.id);

    // Fetch tasks for those projects
    const tasks = await db.task.findMany({
      where: {
        projectId: {
          in: projectIds,
        },
      },
      select: {
        id: true,
        description: true,
        status: true,
        dueDate: true,
        assigneeId: true,
        projectId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      projects,
      workspaceMembers,
      tasks,
    };

  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Internal server error",
    };
  }
};
