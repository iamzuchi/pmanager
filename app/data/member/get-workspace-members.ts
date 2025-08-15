import { db } from "@/lib/db";
import { userRequired } from "../user/is-user-authenticated";

export const getWorkspaceMembers = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();

    // Check if the user is a member of the workspace
    const isMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (!isMember) {
      throw new Error("You are not a member of this workspace.");
    }

    // Fetch all workspace members
    const members = await db.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return members;
  } catch (error) {
    console.error("Failed to fetch workspace members:", error);
    return [];
  }
};
