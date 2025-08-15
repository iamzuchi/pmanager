import { db } from "@/lib/db";
import { userRequired } from "../user/is-user-authenticated";

export const getTaskById = async (
  taskId: string,
  workspaceId: string,
  projectId: string
) => {
  const { user } = await userRequired();

  const isUserMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (!isUserMember) throw new Error("You are not a member of this workspace");

  const projectAccess = await db.projectAccess.findUnique({
    where: {
      workspaceMemberId_projectId: {
        workspaceMemberId: isUserMember.id,
        projectId,
      },
    },
  });

  if (!projectAccess) {
    throw new Error("You are not allowed to view this project");
  }

  const [task, comments] = await Promise.all([
    db.task.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: { select: { id: true, name: true, image: true } },
        attachments: { select: { id: true, name: true, url: true, type: true, createdAt: true, taskId: true } },
        project: {
          include: {
            documentation: true,
            projectAccess: {
              include: {
                workspaceMember: {
                  include: {
                    user: {
                      select: { id: true, name: true, image: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    db.comment.findMany({
      where: { projectId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    }),

    
  ]);

  const project = {
    ...task?.project,
    documentation: task?.project.documentation,
    members: task?.project.projectAccess.map(
      (access) => access.workspaceMember
    ),
  };

  return {
    task: { ...task, project },
    comments,
  };
};